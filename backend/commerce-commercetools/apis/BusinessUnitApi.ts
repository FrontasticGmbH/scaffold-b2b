import { BusinessUnit, BusinessUnitStatus, BusinessUnitType, StoreMode } from '@Types/business-unit/BusinessUnit';
import { StoreApi } from './StoreApi';
import {
  BaseAddress,
  BusinessUnitDraft,
  BusinessUnitPagedQueryResponse,
  BusinessUnitUpdateAction,
} from '@commercetools/platform-sdk';
import { BusinessUnitMapper } from '../mappers/BusinessUnitMapper';
import { BaseApi } from '@Commerce-commercetools/apis/BaseApi';
import { Store } from '@Types/store/Store';
import { Account } from '@Types/account/Account';
import { ExternalError } from '@Commerce-commercetools/utils/Errors';
import { businessUnitKeyFormatter } from '@Commerce-commercetools/utils/BussinessUnitFormatter';
import { AssociateRole } from '@Types/business-unit/Associate';

const MAX_LIMIT = 50;

export class BusinessUnitApi extends BaseApi {
  createForAccountAndStore: (account: Account, store: Store) => Promise<BusinessUnit> = async (
    account: Account,
    store: Store,
  ) => {
    const locale = await this.getCommercetoolsLocal();

    const businessUnitKey = businessUnitKeyFormatter(account.companyName);

    const businessUnitDraft: BusinessUnitDraft = {
      key: businessUnitKey,
      name: account.companyName,
      status: BusinessUnitStatus.Active,
      stores: [
        {
          typeId: 'store',
          id: store.storeId,
        },
      ],
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

    return this.requestBuilder()
      .businessUnits()
      .post({
        body: businessUnitDraft,
      })
      .execute()
      .then((response) => {
        return BusinessUnitMapper.commercetoolsBusinessUnitToBusinessUnit(response.body, locale, [store]);
      })
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  };

  delete: (businessUnitKey: string) => Promise<BusinessUnit> = async (businessUnitKey: string) => {
    const locale = await this.getCommercetoolsLocal();

    return this.getByKey(businessUnitKey).then((businessUnit) => {
      return this.requestBuilder()
        .businessUnits()
        .withKey({ key: businessUnitKey })
        .delete({
          queryArgs: {
            version: businessUnit.version,
          },
        })
        .execute()
        .then((response) => {
          return BusinessUnitMapper.commercetoolsBusinessUnitToBusinessUnit(response.body, locale);
        })
        .catch((error) => {
          throw new ExternalError({ status: error.code, message: error.message, body: error.body });
        });
    });
  };

  update: (businessUnitKey: string, actions: BusinessUnitUpdateAction[]) => Promise<BusinessUnit> = async (
    businessUnitKey: string,
    actions: BusinessUnitUpdateAction[],
  ) => {
    const locale = await this.getCommercetoolsLocal();

    return this.getByKey(businessUnitKey).then((businessUnit) =>
      this.requestBuilder()
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
          throw new ExternalError({ status: error.code, message: error.message, body: error.body });
        }),
    );
  };

  query: (where: string | string[], expand?: string | string[]) => Promise<BusinessUnitPagedQueryResponse> = async (
    where: string | string[],
    expand?: string | string[],
  ) => {
    try {
      return this.requestBuilder()
        .businessUnits()
        .get({
          queryArgs: {
            where,
            expand,
            limit: MAX_LIMIT,
          },
        })
        .execute()
        .then((res) => res.body as BusinessUnitPagedQueryResponse);
    } catch (e) {
      throw e;
    }
  };

  get: (key: string, account: Account) => Promise<BusinessUnit> = async (key: string, account: Account) => {
    const locale = await this.getCommercetoolsLocal();

    const storeApi = new StoreApi(this.frontasticContext, this.locale, this.currency);

    try {
      const businessUnit = await this.query(
        [`associates(customer(id="${account.accountId}"))`, `key in ("${key}")`],
        'associates[*].customer',
      ).then((response) => {
        if (response.count >= 1) {
          return BusinessUnitMapper.commercetoolsBusinessUnitToBusinessUnit(response.results[0], locale);
        }

        throw new Error(`Business unit "${key}" not found for this account`);
      });

      const storeKeys = businessUnit?.stores?.map((store) => `"${store.key}"`).join(' ,');
      const allStores = await storeApi.query(`key in (${storeKeys})`);

      businessUnit.stores = BusinessUnitMapper.expandStores(businessUnit.stores, allStores);

      return businessUnit;
    } catch (e) {
      throw e;
    }
  };

  getByKey: (key: string) => Promise<BusinessUnit> = async (key: string) => {
    const locale = await this.getCommercetoolsLocal();

    try {
      return this.requestBuilder()
        .businessUnits()
        .withKey({ key })
        .get()
        .execute()
        .then((response) => {
          return BusinessUnitMapper.commercetoolsBusinessUnitToBusinessUnit(response.body, locale);
        });
    } catch (e) {
      throw e;
    }
  };

  getBusinessUnitsForUser: (account: Account, expandStores?: boolean) => Promise<BusinessUnit[]> = async (
    account: Account,
    expandStores?: boolean,
  ) => {
    const locale = await this.getCommercetoolsLocal();

    const storeApi = new StoreApi(this.frontasticContext, this.locale, this.currency);

    const businessUnits = await this.query(
      `associates(customer(id="${account.accountId}"))`,
      'associates[*].customer',
    ).then((response) => {
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
  };

  getAssociateRoles: () => Promise<AssociateRole[]> = async () => {
    try {
      return this.requestBuilder()
        .associateRoles()
        .get()
        .execute()
        .then((response) => {
          return (
            response.body.results
              // Filter out roles that can't be assigned by another associates.
              .filter((associateRole) => associateRole.buyerAssignable)
              .map((associateRole) => BusinessUnitMapper.mapCommercetoolsAssociateRoleToAssociateRole(associateRole))
          );
        })
        .catch((error) => {
          throw error;
        });
    } catch {
      throw '';
    }
  };

  async updateBusinessUnit(requestData: BusinessUnit) {
    let businessUnit;

    if (requestData.name) {
      businessUnit = await this.update(requestData.key, [
        {
          action: 'changeName',
          name: requestData.name,
        },
      ]);
    } else if (requestData.contactEmail) {
      businessUnit = await this.update(requestData.key, [
        {
          action: 'setContactEmail',
          contactEmail: requestData.contactEmail,
        },
      ]);
    }

    return businessUnit;
  }

  async updateBusinessUnitAddress(businessUnitKey: string, address: BaseAddress) {
    return await this.update(businessUnitKey, [
      {
        action: 'changeAddress',
        addressId: address.id,
        address: address,
      },
    ]);
  }

  async addBusinessUnitAddress(businessUnitKey: string, address: BaseAddress) {
    return await this.update(businessUnitKey, [
      {
        action: 'addAddress',
        address: address,
      },
    ]);
  }

  async removeBusinessUnitAddress(businessUnitKey: string, addressId: string) {
    return await this.update(businessUnitKey, [
      {
        action: 'removeAddress',
        addressId,
      },
    ]);
  }

  async updateAssociate(businessUnitKey: string, accountId: string, associateRoleKeys: string[]) {
    return await this.update(businessUnitKey, [
      {
        action: 'changeAssociate',
        associate: {
          customer: {
            typeId: 'customer',
            id: accountId,
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

  async removeAssociate(businessUnitKey: string, accountId: string) {
    return await this.update(businessUnitKey, [
      {
        action: 'removeAssociate',
        customer: {
          typeId: 'customer',
          id: accountId,
        },
      },
    ]);
  }

  async addAssociate(businessUnitKey: string, accountId: string, associateRoleKeys: string[]) {
    return await this.update(businessUnitKey, [
      {
        action: 'addAssociate',
        associate: {
          customer: {
            typeId: 'customer',
            id: accountId,
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
