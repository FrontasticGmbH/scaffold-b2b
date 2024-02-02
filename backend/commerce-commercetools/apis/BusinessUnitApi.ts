import { BusinessUnit, BusinessUnitStatus, BusinessUnitType, StoreMode } from '@Types/business-unit/BusinessUnit';
import { StoreApi } from './StoreApi';
import {
  BaseAddress,
  BusinessUnitDraft,
  BusinessUnitPagedQueryResponse,
  BusinessUnitUpdateAction,
} from '@commercetools/platform-sdk';
import { BusinessUnitMapper } from '../mappers/BusinessUnitMapper';
import { Store } from '@Types/store/Store';
import { Account } from '@Types/account/Account';
import { ExternalError } from '@Commerce-commercetools/errors/ExternalError';
import { businessUnitKeyFormatter } from '@Commerce-commercetools/utils/BussinessUnitFormatter';
import { AssociateRole } from '@Types/business-unit/Associate';
import { BaseApi } from '@Commerce-commercetools/apis/BaseApi';
import { ResourceNotFoundError } from '@Commerce-commercetools/errors/ResourceNotFoundError';

const MAX_LIMIT = 50;

export class BusinessUnitApi extends BaseApi {
  async createForAccountAndStore(account: Account, store: Store): Promise<BusinessUnit> {
    const locale = await this.getCommercetoolsLocal();

    const businessUnitKey = businessUnitKeyFormatter(account.companyName);

    const stores = store?.storeId ? { id: store.storeId } : { key: store.key };

    const businessUnitDraft: BusinessUnitDraft = {
      key: businessUnitKey,
      name: account.companyName,
      status: BusinessUnitStatus.Active,
      stores: [{ ...stores, typeId: 'store' }],
      storeMode: StoreMode.Explicit,
      unitType: BusinessUnitType.Company,
      contactEmail: account.email,
      associates: [
        {
          associateRoleAssignments: [
            {
              associateRole: {
                key: this.associateRoleAdminKey,
                typeId: 'associate-role',
              },
            },
            {
              associateRole: {
                key: this.associateRoleBuyerKey,
                typeId: 'associate-role',
              },
            },
          ],
          customer: {
            id: account.accountId,
            typeId: 'customer',
          },
        },
      ],
    };

    return this.associateRequestBuilder(account.accountId)
      .businessUnits()
      .post({
        body: businessUnitDraft,
      })
      .execute()
      .then((response) => {
        return BusinessUnitMapper.commercetoolsBusinessUnitToBusinessUnit(response.body, locale, [store]);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async update(businessUnitKey: string, accountId: string, actions: BusinessUnitUpdateAction[]): Promise<BusinessUnit> {
    const locale = await this.getCommercetoolsLocal();

    return this.getByKey(businessUnitKey).then((businessUnit) =>
      this.associateRequestBuilder(accountId)
        .businessUnits()
        .withKey({ key: businessUnitKey })
        .post({
          body: {
            version: businessUnit.version,
            actions,
          },
        })
        .execute()
        .then((response) => {
          return BusinessUnitMapper.commercetoolsBusinessUnitToBusinessUnit(response.body, locale);
        })
        .catch((error) => {
          throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
        }),
    );
  }

  async query(accountId: string, businessUnitKey?: string): Promise<BusinessUnitPagedQueryResponse> {
    const whereClause = [];
    if (businessUnitKey) {
      whereClause.push(`key in ("${businessUnitKey}")`);
    }
    const expand = 'associates[*].customer';

    return this.associateRequestBuilder(accountId)
      .businessUnits()
      .get({
        queryArgs: {
          whereClause,
          expand,
          limit: MAX_LIMIT,
        },
      })
      .execute()
      .then((response) => {
        return response.body;
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async get(businessUnitKey: string, accountId: string): Promise<BusinessUnit> {
    const locale = await this.getCommercetoolsLocal();

    const storeApi = new StoreApi(this.frontasticContext, this.locale, this.currency);

    const businessUnit = await this.query(accountId, businessUnitKey).then((response) => {
      if (response.count >= 1) {
        return BusinessUnitMapper.commercetoolsBusinessUnitToBusinessUnit(response.results[0], locale);
      }

      throw new ResourceNotFoundError({ message: `Business unit "${businessUnitKey}" not found for this account` });
    });

    const storeKeys = businessUnit?.stores?.map((store) => `"${store.key}"`).join(' ,');
    const allStores = await storeApi.query(`key in (${storeKeys})`);

    businessUnit.stores = BusinessUnitMapper.expandStores(businessUnit.stores, allStores);

    return businessUnit;
  }

  async getByKey(businessUnitKey: string): Promise<BusinessUnit> {
    const locale = await this.getCommercetoolsLocal();

    return this.requestBuilder()
      .businessUnits()
      .withKey({ key: businessUnitKey })
      .get()
      .execute()
      .then((response) => {
        return BusinessUnitMapper.commercetoolsBusinessUnitToBusinessUnit(response.body, locale);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async getBusinessUnitsForUser(accountId: string, expandStores?: boolean): Promise<BusinessUnit[]> {
    const locale = await this.getCommercetoolsLocal();

    const storeApi = new StoreApi(this.frontasticContext, this.locale, this.currency);

    const businessUnits = await this.query(accountId).then((response) => {
      return response.results.map((commercetoolsBusinessUnit) => {
        return BusinessUnitMapper.commercetoolsBusinessUnitToBusinessUnit(commercetoolsBusinessUnit, locale);
      });
    });

    if (expandStores) {
      const storeKeys = businessUnits
        .reduce((prev: Store[], curr) => {
          prev = prev.concat(curr.stores || []);
          return prev;
        }, [])
        ?.map((store) => `"${store.key}"`)
        .join(' ,');

      const allStores = storeKeys ? await storeApi.query(`key in (${storeKeys})`) : [];

      businessUnits.map((businessUnit) => {
        businessUnit.stores = BusinessUnitMapper.expandStores(businessUnit.stores, allStores);
      });
    }

    return businessUnits;
  }

  async getAssociateRoles(): Promise<AssociateRole[]> {
    return this.requestBuilder()
      .associateRoles()
      .get()
      .execute()
      .then((response) => {
        return response.body.results
          .filter((associateRole) => associateRole.buyerAssignable)
          .map((associateRole) => BusinessUnitMapper.mapCommercetoolsAssociateRoleToAssociateRole(associateRole));
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async updateBusinessUnit(requestData: BusinessUnit, accountId: string): Promise<BusinessUnit> {
    let businessUnit;

    if (requestData.name) {
      businessUnit = await this.update(requestData.key, accountId, [
        {
          action: 'changeName',
          name: requestData.name,
        },
      ]);
    } else if (requestData.contactEmail) {
      businessUnit = await this.update(requestData.key, accountId, [
        {
          action: 'setContactEmail',
          contactEmail: requestData.contactEmail,
        },
      ]);
    }

    return businessUnit;
  }

  async updateBusinessUnitAddress(businessUnitKey: string, accountId: string, address: BaseAddress) {
    return await this.update(businessUnitKey, accountId, [
      {
        action: 'changeAddress',
        addressId: address.id,
        address: address,
      },
    ]);
  }

  async addBusinessUnitAddress(businessUnitKey: string, accountId: string, address: BaseAddress) {
    return await this.update(businessUnitKey, accountId, [
      {
        action: 'addAddress',
        address: address,
      },
    ]);
  }

  async removeBusinessUnitAddress(businessUnitKey: string, accountId: string, addressId: string) {
    return await this.update(businessUnitKey, accountId, [
      {
        action: 'removeAddress',
        addressId,
      },
    ]);
  }

  async updateAssociate(businessUnitKey: string, accountId: string, associateId: string, associateRoleKeys: string[]) {
    return await this.update(businessUnitKey, accountId, [
      {
        action: 'changeAssociate',
        associate: {
          customer: {
            typeId: 'customer',
            id: associateId,
          },
          associateRoleAssignments: associateRoleKeys.map((roleKey) => ({
            associateRole: {
              typeId: 'associate-role',
              key: roleKey,
            },
          })),
        },
      },
    ]);
  }

  async removeAssociate(businessUnitKey: string, accountId: string, associateAccountId: string) {
    return await this.update(businessUnitKey, accountId, [
      {
        action: 'removeAssociate',
        customer: {
          typeId: 'customer',
          id: associateAccountId,
        },
      },
    ]);
  }

  async addAssociate(businessUnitKey: string, accountId: string, associateId: string, associateRoleKeys: string[]) {
    return await this.update(businessUnitKey, accountId, [
      {
        action: 'addAssociate',
        associate: {
          customer: {
            typeId: 'customer',
            id: associateId,
          },
          associateRoleAssignments: associateRoleKeys.map((roleKey) => ({
            associateRole: {
              typeId: 'associate-role',
              key: roleKey,
            },
          })),
        },
      },
    ]);
  }
}
