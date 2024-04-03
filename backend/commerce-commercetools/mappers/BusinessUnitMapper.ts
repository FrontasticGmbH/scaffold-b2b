import {
  Associate as CommercetoolsAssociate,
  AssociateRole as CommercetoolsAssociateRole,
  InheritedAssociate as CommercetoolsInheritedAssociate,
  BusinessUnit as CommercetoolsBusinessUnit,
  StoreKeyReference as CommercetoolsStoreKeyReference,
  Permission as CommercetoolsPermission,
  AssociateRoleKeyReference as CommercetoolsAssociateRoleKeyReference,
  BusinessUnitKeyReference as CommercetoolsBusinessUnitKeyReference,
} from '@commercetools/platform-sdk';
import { BusinessUnit } from '@Types/business-unit/BusinessUnit';
import { Store } from '@Types/store/Store';
import { Associate, AssociateRole, Permission } from '@Types/business-unit/Associate';
import { AccountMapper } from '@Commerce-commercetools/mappers/AccountMapper';
import { ValidationError } from '@Commerce-commercetools/errors/ValidationError';

export class BusinessUnitMapper {
  static commercetoolsBusinessUnitToBusinessUnit(commercetoolsBusinessUnit: CommercetoolsBusinessUnit): BusinessUnit {
    return {
      businessUnitId: commercetoolsBusinessUnit.id,
      key: commercetoolsBusinessUnit.key,
      name: commercetoolsBusinessUnit.name,
      status: commercetoolsBusinessUnit.status,
      stores: commercetoolsBusinessUnit.stores?.map((commercetoolsStoreKeyReference) => {
        return this.commercetoolsStoreKeyReferencesToStore(commercetoolsStoreKeyReference);
      }),
      storeMode: commercetoolsBusinessUnit.storeMode,
      unitType: commercetoolsBusinessUnit.unitType,
      contactEmail: commercetoolsBusinessUnit.contactEmail,
      addresses: AccountMapper.commercetoolsAddressesToAddresses(
        commercetoolsBusinessUnit.addresses,
        commercetoolsBusinessUnit.defaultBillingAddressId,
        commercetoolsBusinessUnit.defaultShippingAddressId,
        commercetoolsBusinessUnit.billingAddressIds,
        commercetoolsBusinessUnit.shippingAddressIds,
      ),
      defaultShippingAddressId: commercetoolsBusinessUnit.defaultShippingAddressId,
      defaultBillingAddressId: commercetoolsBusinessUnit.defaultBillingAddressId,
      associates: this.commercetoolsAssociatesToAssociate(
        commercetoolsBusinessUnit.associates,
        commercetoolsBusinessUnit.inheritedAssociates,
      ),
      parentUnit: commercetoolsBusinessUnit.parentUnit
        ? this.commercetoolsBusinessUnitKeyReferenceToBusinessUnit(commercetoolsBusinessUnit.parentUnit)
        : undefined,
      topLevelUnit: commercetoolsBusinessUnit.topLevelUnit
        ? this.commercetoolsBusinessUnitKeyReferenceToBusinessUnit(commercetoolsBusinessUnit.topLevelUnit)
        : undefined,
      version: commercetoolsBusinessUnit.version,
    };
  }

  static commercetoolsBusinessUnitKeyReferenceToBusinessUnit(
    commercetoolsBusinessUnitKeyReference: CommercetoolsBusinessUnitKeyReference,
  ): BusinessUnit {
    return {
      key: commercetoolsBusinessUnitKeyReference.key,
    };
  }

  static commercetoolsAssociatesToAssociate(
    commercetoolsAssociates: CommercetoolsAssociate[],
    commercetoolsInheritedAssociates?: CommercetoolsInheritedAssociate[],
  ): Associate[] {
    const associates: Associate[] = [];

    commercetoolsAssociates
      .filter((commercetoolsAssociate) => commercetoolsAssociate.customer?.obj)
      .map((commercetoolsAssociate) => {
        const associate: Associate = AccountMapper.commercetoolsCustomerToAccount(commercetoolsAssociate.customer?.obj);

        associate.roles = commercetoolsAssociate.associateRoleAssignments?.map(
          (commercetoolsAssociateRoleAssigment) => {
            return this.commercetoolsAssociateRoleKeyReferenceToAssociateRole(
              commercetoolsAssociateRoleAssigment.associateRole,
            );
          },
        );

        associates.push(associate);
      });

    if (commercetoolsInheritedAssociates !== undefined) {
      commercetoolsInheritedAssociates
        .filter((commercetoolsInheritedAssociate) => commercetoolsInheritedAssociate.customer?.obj)
        .map((commercetoolsInheritedAssociate) => {
          const associate: Associate = AccountMapper.commercetoolsCustomerToAccount(
            commercetoolsInheritedAssociate.customer?.obj,
          );

          associate.roles = commercetoolsInheritedAssociate.associateRoleAssignments?.map(
            (commercetoolsAssociateRoleAssigment) => {
              return this.commercetoolsAssociateRoleKeyReferenceToAssociateRole(
                commercetoolsAssociateRoleAssigment.associateRole,
              );
            },
          );

          associates.push(associate);
        });
    }

    return associates;
  }

  static commercetoolsAssociateRoleKeyReferenceToAssociateRole(
    commercetoolsAssociateRoleKeyReference: CommercetoolsAssociateRoleKeyReference,
  ): AssociateRole {
    return {
      key: commercetoolsAssociateRoleKeyReference.key,
    };
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
            distributionChannels: storeObj?.distributionChannels,
            supplyChannels: storeObj?.supplyChannels,
          }
        : (store as Store);
    });
  }

  static commercetoolsStoreKeyReferencesToStore(commercetoolsStoreKeyReference: CommercetoolsStoreKeyReference): Store {
    return {
      key: commercetoolsStoreKeyReference.key,
    };
  }

  static commercetoolsAssociateRoleToAssociateRole(associateRole: CommercetoolsAssociateRole): AssociateRole {
    return {
      key: associateRole.key,
      name: associateRole.name,
      permissions: this.commercetoolsPermissionsToPermissions(associateRole.permissions),
    };
  }

  static commercetoolsPermissionsToPermissions(commercetoolsPermissions: CommercetoolsPermission[]): Permission[] {
    const permissions: Permission[] = [];

    commercetoolsPermissions.forEach((commercetoolsPermission) => {
      switch (commercetoolsPermission) {
        case 'AcceptMyQuotes':
        case 'AcceptOthersQuotes':
        case 'AddChildUnits':
        case 'CreateApprovalRules':
        case 'CreateMyCarts':
        case 'CreateMyOrdersFromMyCarts':
        case 'CreateMyOrdersFromMyQuotes':
        case 'CreateMyQuoteRequestsFromMyCarts':
        case 'CreateOrdersFromOthersCarts':
        case 'CreateOrdersFromOthersQuotes':
        case 'CreateOthersCarts':
        case 'CreateQuoteRequestsFromOthersCarts':
        case 'DeclineMyQuotes':
        case 'DeclineOthersQuotes':
        case 'DeleteMyCarts':
        case 'DeleteOthersCarts':
        case 'ReassignMyQuotes':
        case 'ReassignOthersQuotes':
        case 'RenegotiateMyQuotes':
        case 'RenegotiateOthersQuotes':
        case 'UpdateApprovalFlows':
        case 'UpdateApprovalRules':
        case 'UpdateAssociates':
        case 'UpdateBusinessUnitDetails':
        case 'UpdateMyCarts':
        case 'UpdateMyOrders':
        case 'UpdateMyQuoteRequests':
        case 'UpdateOthersCarts':
        case 'UpdateOthersOrders':
        case 'UpdateOthersQuoteRequests':
        case 'UpdateParentUnit':
        case 'ViewMyCarts':
        case 'ViewMyOrders':
        case 'ViewMyQuoteRequests':
        case 'ViewMyQuotes':
        case 'ViewOthersCarts':
        case 'ViewOthersOrders':
        case 'ViewOthersQuoteRequests':
        case 'ViewOthersQuotes':
          return permissions.push(commercetoolsPermission);
        default:
          throw new ValidationError({ message: 'Invalid permission' });
      }
    });

    return permissions;
  }
}
