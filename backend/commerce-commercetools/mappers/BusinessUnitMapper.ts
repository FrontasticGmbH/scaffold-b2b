import {
  Associate as CommercetoolsAssociate,
  BusinessUnit as CommercetoolsBusinessUnit,
  StoreKeyReference as CommercetoolsStoreKeyReference,
} from '@commercetools/platform-sdk';
import { BusinessUnit } from '@Types/business-unit/BusinessUnit';
import { Store } from '@Types/store/Store';
import { Associate, AssociateRole } from '@Types/business-unit/Associate';
import { AccountMapper } from '@Commerce-commercetools/mappers/AccountMapper';
import { Locale } from '@Commerce-commercetools/interfaces/Locale';
import {
  AssociateRoleAssignment as CommercetoolsAssociateRoleAssignment,
  BusinessUnitKeyReference as CommercetoolsBusinessUnitKeyReference,
} from '@commercetools/platform-sdk/dist/declarations/src/generated/models/business-unit';
import { AssociateRole as CommercetoolsAssociateRole } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/associate-role';

export class BusinessUnitMapper {
  static commercetoolsBusinessUnitToBusinessUnit(
    commercetoolsBusinessUnit: CommercetoolsBusinessUnit,
    locale: Locale,
    allStores?: Store[],
  ): BusinessUnit {
    const businessUnit: BusinessUnit = {
      businessUnitId: commercetoolsBusinessUnit.id,
      key: commercetoolsBusinessUnit.key,
      name: commercetoolsBusinessUnit.name,
      status: commercetoolsBusinessUnit.status,
      stores: commercetoolsBusinessUnit.stores?.map((commercetoolsStoreKeyReference) => {
        return this.mapCommercetoolsStoreKeyReferencesToStore(commercetoolsStoreKeyReference);
      }),
      storeMode: commercetoolsBusinessUnit.storeMode,
      unitType: commercetoolsBusinessUnit.unitType,
      contactEmail: commercetoolsBusinessUnit.contactEmail,
      addresses: commercetoolsBusinessUnit.addresses?.map((commercetoolsAddress) => {
        return AccountMapper.commercetoolsAddressToAddress(commercetoolsAddress);
      }),
      defaultShippingAddressId: commercetoolsBusinessUnit.defaultShippingAddressId,
      defaultBillingAddressId: commercetoolsBusinessUnit.defaultBillingAddressId,
      associates: this.mapReferencedAssociatesToAssociate(commercetoolsBusinessUnit.associates, locale),
      parentUnit: commercetoolsBusinessUnit.parentUnit
        ? this.commercetoolsBusinessUnitKeyReferenceToBusinessUnit(commercetoolsBusinessUnit.parentUnit)
        : undefined,
      topLevelUnit: commercetoolsBusinessUnit.topLevelUnit
        ? this.commercetoolsBusinessUnitKeyReferenceToBusinessUnit(commercetoolsBusinessUnit.topLevelUnit)
        : undefined,
      version: commercetoolsBusinessUnit.version,
    };

    if (allStores) {
      businessUnit.stores = this.expandStores(businessUnit.stores, allStores);
    }

    return businessUnit;
  }

  static commercetoolsBusinessUnitKeyReferenceToBusinessUnit(
    commercetoolsBusinessUnitKeyReference: CommercetoolsBusinessUnitKeyReference,
  ): BusinessUnit {
    return {
      key: commercetoolsBusinessUnitKeyReference.key,
    };
  }

  static mapReferencedAssociatesToAssociate(
    commercetoolsAssociates: CommercetoolsAssociate[],
    locale: Locale,
  ): Associate[] {
    return commercetoolsAssociates
      .filter((commercetoolsAssociate) => commercetoolsAssociate.customer?.obj)
      .map((commercetoolsAssociate) => {
        const associate: Associate = AccountMapper.commercetoolsCustomerToAccount(
          commercetoolsAssociate.customer?.obj,
          locale,
        );

        associate.roles = commercetoolsAssociate.associateRoleAssignments?.map((associateRoleAssigment) => {
          return this.mapCommercetoolsAssociateRoleAssignmentToAssociateRole(associateRoleAssigment);
        });

        return associate;
      });
  }

  static expandStores(stores: Store[], allStores: Store[]): Store[] {
    return stores?.map((store) => {
      const storeObj = allStores.find((s) => s.key === store.key);
      return storeObj
        ? {
            name: storeObj.name,
            key: storeObj.key,
            typeId: 'store',
            storeId: storeObj.storeId,
          }
        : (store as Store);
    });
  }

  static mapCommercetoolsStoreKeyReferencesToStore(
    commercetoolsStoreKeyReference: CommercetoolsStoreKeyReference,
  ): Store {
    return {
      key: commercetoolsStoreKeyReference.key,
    };
  }

  static mapCommercetoolsAssociateRoleAssignmentToAssociateRole(
    associateRoleAssigment: CommercetoolsAssociateRoleAssignment,
  ): AssociateRole {
    return {
      associateRoleId: associateRoleAssigment.associateRole.id,
      key: associateRoleAssigment.associateRole.key,
    };
  }

  static mapCommercetoolsAssociateRoleToAssociateRole(associateRole: CommercetoolsAssociateRole): AssociateRole {
    return {
      associateRoleId: associateRole.id,
      key: associateRole.key,
      name: associateRole.name,
    };
  }
}
