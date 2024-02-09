import { BusinessUnit, BusinessUnitStatus, BusinessUnitType, StoreMode } from '@Types/business-unit/BusinessUnit';
import { BaseAddress, BusinessUnitDraft, BusinessUnitUpdateAction } from '@commercetools/platform-sdk';
import { Store } from '@Types/store/Store';
import { Account } from '@Types/account/Account';
import { AssociateRole } from '@Types/business-unit/Associate';
import { BusinessUnitMapper } from '../mappers/BusinessUnitMapper';
import { StoreApi } from './StoreApi';
import { ExternalError } from '@Commerce-commercetools/errors/ExternalError';
import { businessUnitKeyFormatter } from '@Commerce-commercetools/utils/BussinessUnitFormatter';
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

  async getByKeyForUser(businessUnitKey: string, accountId: string, expandStores?: boolean): Promise<BusinessUnit> {
    const locale = await this.getCommercetoolsLocal();

    const businessUnit = await this.associateRequestBuilder(accountId)
      .businessUnits()
      .withKey({ key: businessUnitKey })
      .get()
      .execute()
      .then((response) => {
        return BusinessUnitMapper.commercetoolsBusinessUnitToBusinessUnit(response.body, locale);
      })
      .catch((error) => {
        if (error.code === 404) {
          throw new ResourceNotFoundError({ message: `Business unit "${businessUnitKey}" not found for this account` });
        }

        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });

    if (expandStores) {
      const storeApi = new StoreApi(this.frontasticContext, this.locale, this.currency);
      const storeKeys = businessUnit?.stores?.map((store) => `"${store.key}"`).join(' ,');
      const allStores = await storeApi.query(`key in (${storeKeys})`);

      businessUnit.stores = BusinessUnitMapper.expandStores(businessUnit.stores, allStores);
    }

    return businessUnit;
  }

  async getBusinessUnitsForUser(accountId: string, expandStores?: boolean): Promise<BusinessUnit[]> {
    const locale = await this.getCommercetoolsLocal();

    const expand = 'associates[*].customer';

    const businessUnits = await this.associateRequestBuilder(accountId)
      .businessUnits()
      .get({
        queryArgs: {
          expand,
          limit: MAX_LIMIT,
        },
      })
      .execute()
      .then((response) => {
        return response.body.results.map((commercetoolsBusinessUnit) => {
          return BusinessUnitMapper.commercetoolsBusinessUnitToBusinessUnit(commercetoolsBusinessUnit, locale);
        });
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });

    if (expandStores) {
      const storeApi = new StoreApi(this.frontasticContext, this.locale, this.currency);

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
    let businessUnit = requestData;
    const updateActions: Array<BusinessUnitUpdateAction> = [];

    if (requestData.name) {
      updateActions.push({
        action: 'changeName',
        name: requestData.name,
      });
    }
    if (requestData.contactEmail) {
      updateActions.push({
        action: 'setContactEmail',
        contactEmail: requestData.contactEmail,
      });
    }
    if (updateActions.length > 0) {
      businessUnit = await this.update(requestData.key, accountId, updateActions);
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

  async assertUserIsAssociate(accountId: string, businessUnitKey: string, storeKey: string) {
    const businessUnit = await this.getByKeyForUser(businessUnitKey, accountId);

    if (!businessUnit.stores?.find((store) => store.key === storeKey)) {
      throw new ResourceNotFoundError({ message: `User is not an associate of the store "${storeKey}"` });
    }
  }
}
