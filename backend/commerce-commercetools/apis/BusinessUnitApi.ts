import { BusinessUnit, BusinessUnitStatus, BusinessUnitType, StoreMode } from '@Types/business-unit/BusinessUnit';
import { AssociateRoleAssignmentDraft, BusinessUnitDraft, BusinessUnitUpdateAction } from '@commercetools/platform-sdk';
import { Store } from '@Types/store/Store';
import { Account } from '@Types/account/Account';
import { AssociateRole } from '@Types/business-unit/Associate';
import { Address } from '@Types/account';
import BusinessUnitMapper from '../mappers/BusinessUnitMapper';
import { ExternalError } from '@Commerce-commercetools/errors/ExternalError';
import { businessUnitKeyFormatter } from '@Commerce-commercetools/utils/BussinessUnitFormatter';
import BaseApi from '@Commerce-commercetools/apis/BaseApi';
import { ResourceNotFoundError } from '@Commerce-commercetools/errors/ResourceNotFoundError';
import AccountMapper from '@Commerce-commercetools/mappers/AccountMapper';
import Guid from '@Commerce-commercetools/utils/Guid';
import getStoreApi from '@Commerce-commercetools/utils/apiConstructors/getStoreApi';

const MAX_LIMIT = 50;

export default class BusinessUnitApi extends BaseApi {
  async createForAccount(account: Account): Promise<BusinessUnit> {
    const businessUnitKey = businessUnitKeyFormatter(account.companyName);

    const associateRoleAssignments = this.defaultAssociateRoleKeys.map((associateRoleKey) => {
      const associateRoleAssignment: AssociateRoleAssignmentDraft = {
        associateRole: {
          typeId: 'associate-role',
          key: associateRoleKey,
        },
        inheritance: `Enabled`,
      };

      return associateRoleAssignment;
    });

    const businessUnitDraft: BusinessUnitDraft = {
      key: businessUnitKey,
      name: account.companyName,
      status: BusinessUnitStatus.Active,
      stores: [{ key: this.clientSettings.defaultStoreKey, typeId: 'store' }],
      storeMode: StoreMode.Explicit,
      unitType: BusinessUnitType.Company,
      contactEmail: account.email,
      associates: [
        {
          associateRoleAssignments,
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
        return BusinessUnitMapper.commercetoolsBusinessUnitToBusinessUnit(response.body);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async update(businessUnitKey: string, accountId: string, actions: BusinessUnitUpdateAction[]): Promise<BusinessUnit> {
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
          return BusinessUnitMapper.commercetoolsBusinessUnitToBusinessUnit(response.body);
        })
        .catch((error) => {
          throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
        }),
    );
  }

  async getByKey(businessUnitKey: string): Promise<BusinessUnit> {
    return this.requestBuilder()
      .businessUnits()
      .withKey({ key: businessUnitKey })
      .get()
      .execute()
      .then((response) => {
        return BusinessUnitMapper.commercetoolsBusinessUnitToBusinessUnit(response.body);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async getByKeyForAccount(businessUnitKey: string, accountId: string, expandStores?: boolean): Promise<BusinessUnit> {
    const expand = ['associates[*].customer', 'inheritedAssociates[*].customer'];

    const businessUnit = await this.associateRequestBuilder(accountId)
      .businessUnits()
      .withKey({ key: businessUnitKey })
      .get({
        queryArgs: {
          expand,
          limit: MAX_LIMIT,
        },
      })
      .execute()
      .then((response) => {
        return BusinessUnitMapper.commercetoolsBusinessUnitToBusinessUnit(response.body);
      })
      .catch((error) => {
        if (error.code === 404) {
          throw new ResourceNotFoundError({ message: `Business unit "${businessUnitKey}" not found for this account` });
        }

        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });

    if (expandStores) {
      // The SDK doesn't return inherited stores, so we need to fetch them manually
      if (businessUnit.storeMode === StoreMode.FromParent) {
        businessUnit.stores = await this.getBusinessUnitStoresFromParentUnitKey(businessUnit.parentUnit.key);
      }

      const storeApi = getStoreApi(this.commercetoolsFrontendContext, this.locale, this.currency);
      const storeKeys = businessUnit?.stores?.map((store) => `"${store.key}"`).join(' ,');

      const allStores = storeKeys ? await storeApi.query(`key in (${storeKeys})`) : [];

      businessUnit.stores = BusinessUnitMapper.expandStores(businessUnit.stores, allStores);
    }

    return businessUnit;
  }

  async getBusinessUnitsForUser(accountId: string, expandStores?: boolean): Promise<BusinessUnit[]> {
    const expand = ['associates[*].customer', 'inheritedAssociates[*].customer'];

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
          return BusinessUnitMapper.commercetoolsBusinessUnitToBusinessUnit(commercetoolsBusinessUnit);
        });
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });

    if (expandStores) {
      // The SDK doesn't return inherited stores, so we need to fetch them manually
      for (const businessUnit of businessUnits) {
        if (businessUnit.storeMode === StoreMode.FromParent) {
          businessUnit.stores = await this.getBusinessUnitStoresFromParentUnitKey(businessUnit.parentUnit.key);
        }
      }

      const storeApi = getStoreApi(this.commercetoolsFrontendContext, this.locale, this.currency);

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
    return this.getCommercetoolsAssociatesRoles()
      .then((associateRoles) => {
        return associateRoles
          .filter((associateRole) => associateRole.buyerAssignable)
          .map((associateRole) => BusinessUnitMapper.commercetoolsAssociateRoleToAssociateRole(associateRole));
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

  async updateBusinessUnitAddress(businessUnitKey: string, accountId: string, address: Address) {
    let commercetoolsAddress = AccountMapper.addressToCommercetoolsAddress(address);

    const businessUnitUpdateAction: BusinessUnitUpdateAction[] = [];

    if (
      commercetoolsAddress.key === undefined &&
      (address.isDefaultBillingAddress || address.isDefaultShippingAddress)
    ) {
      commercetoolsAddress = {
        ...commercetoolsAddress,
        key: Guid.newGuid(),
      };
    }

    businessUnitUpdateAction.push({
      action: 'changeAddress',
      addressId: commercetoolsAddress.id,
      address: commercetoolsAddress,
    });

    const addressIdentifiers = commercetoolsAddress.key
      ? { addressKey: commercetoolsAddress.key }
      : { addressId: commercetoolsAddress.id };

    address.isDefaultBillingAddress
      ? businessUnitUpdateAction.push({ action: 'setDefaultBillingAddress', ...addressIdentifiers })
      : businessUnitUpdateAction.push({ action: 'removeBillingAddressId', ...addressIdentifiers });

    address.isDefaultShippingAddress
      ? businessUnitUpdateAction.push({ action: 'setDefaultShippingAddress', ...addressIdentifiers })
      : businessUnitUpdateAction.push({ action: 'removeShippingAddressId', ...addressIdentifiers });

    return await this.update(businessUnitKey, accountId, businessUnitUpdateAction);
  }

  async addBusinessUnitAddress(businessUnitKey: string, accountId: string, address: Address) {
    let commercetoolsAddress = AccountMapper.addressToCommercetoolsAddress(address);

    const businessUnitUpdateAction: BusinessUnitUpdateAction[] = [];

    // For new address, remove the id as CoCo will set it
    if (commercetoolsAddress.id !== undefined) {
      commercetoolsAddress = {
        ...commercetoolsAddress,
        id: undefined,
      };
    }

    if (commercetoolsAddress.key === undefined) {
      commercetoolsAddress = {
        ...commercetoolsAddress,
        key: Guid.newGuid(),
      };
    }

    businessUnitUpdateAction.push({ action: 'addAddress', address: commercetoolsAddress });

    if (address.isDefaultBillingAddress) {
      businessUnitUpdateAction.push({ action: 'setDefaultBillingAddress', addressKey: commercetoolsAddress.key });
    }

    if (address.isDefaultShippingAddress) {
      businessUnitUpdateAction.push({ action: 'setDefaultShippingAddress', addressKey: commercetoolsAddress.key });
    }

    return await this.update(businessUnitKey, accountId, businessUnitUpdateAction);
  }

  async removeBusinessUnitAddress(businessUnitKey: string, accountId: string, addressId: string) {
    return await this.update(businessUnitKey, accountId, [
      {
        action: 'removeAddress',
        addressId,
      },
    ]);
  }

  async getAssociate(businessUnitKey: string, accountId: string) {
    const businessUnit = await this.getByKeyForAccount(businessUnitKey, accountId);

    // Get associate from business unit
    const associate = businessUnit.associates?.find((associate) => associate.accountId === accountId);

    const commercetoolsAssociateRoles = await this.getCommercetoolsAssociatesRoles();

    // Include permissions in the associate roles
    associate.roles = associate.roles?.map((associateRole) => {
      const commercetoolsAssociateRole = commercetoolsAssociateRoles.find(
        (commercetoolsAssociateRole) => commercetoolsAssociateRole.key === associateRole.key,
      );
      return {
        ...associateRole,
        permissions: BusinessUnitMapper.commercetoolsPermissionsToPermissions(commercetoolsAssociateRole.permissions),
      };
    });

    return associate;
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

  protected async getBusinessUnitStoresFromParentUnitKey(parentUnitKey: string): Promise<Store[]> {
    const businessUnit = await this.getByKey(parentUnitKey);

    if (businessUnit.storeMode === StoreMode.Explicit) {
      return businessUnit.stores;
    }

    return this.getBusinessUnitStoresFromParentUnitKey(businessUnit.parentUnit.key);
  }
}
