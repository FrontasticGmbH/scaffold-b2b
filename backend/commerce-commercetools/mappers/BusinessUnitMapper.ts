import {
  ApprovalFlow as CommercetoolsApprovalFlow,
  ApprovalFlowStatus as CommercetoolsApprovalFlowStatus,
  ApprovalRule as CommercetoolsApprovalRule,
  ApprovalRuleStatus as CommercetoolsApprovalRuleStatus,
  ApproverHierarchy as CommercetoolsApproverHierarchy,
  Associate as CommercetoolsAssociate,
  AssociateRole as CommercetoolsAssociateRole,
  AssociateRoleKeyReference as CommercetoolsAssociateRoleKeyReference,
  BusinessUnit as CommercetoolsBusinessUnit,
  BusinessUnitKeyReference as CommercetoolsBusinessUnitKeyReference,
  InheritedAssociate as CommercetoolsInheritedAssociate,
  OrderReference as CommercetoolsOrderReference,
  Permission as CommercetoolsPermission,
  RuleRequester as CommercetoolsRuleRequester,
  StoreKeyReference as CommercetoolsStoreKeyReference,
} from '@commercetools/platform-sdk';
import { BusinessUnit } from '@Types/business-unit/BusinessUnit';
import { Store } from '@Types/store/Store';
import { Associate, AssociateRole, Permission } from '@Types/business-unit/Associate';
import {
  ApprovalFlow,
  ApprovalFlowStatus,
  ApprovalRule,
  ApprovalRuleStatus,
  ApproverHierarchy,
} from '@Types/business-unit';
import { ApprovalRuleDraft as CommerceToolsApprovalRuleDraft } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/approval-rule';
import { Order } from '@Types/cart';
import AccountMapper from '@Commerce-commercetools/mappers/AccountMapper';
import CartMapper from '@Commerce-commercetools/mappers/CartMapper';
import { Locale } from '@Commerce-commercetools/interfaces/Locale';

export default class BusinessUnitMapper {
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
      const storeObj = allStores.find((storeObj) => storeObj.key === store.key);
      return storeObj
        ? {
            storeId: storeObj.storeId,
            name: storeObj.name,
            key: storeObj.key,
            distributionChannels: storeObj?.distributionChannels,
            supplyChannels: storeObj?.supplyChannels,
            productSelectionIds: storeObj?.productSelectionIds,
          }
        : store;
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
        case 'ViewMyShoppingLists':
        case 'ViewOthersShoppingLists':
        case 'CreateMyShoppingLists':
        case 'CreateOthersShoppingLists':
        case 'DeleteMyShoppingLists':
        case 'DeleteOthersShoppingLists':
        case 'UpdateMyShoppingLists':
        case 'UpdateOthersShoppingLists':
          return permissions.push(commercetoolsPermission as Permission);
        default:
          return undefined;
      }
    });

    return permissions;
  }

  static commercetoolsApprovalRuleToApprovalRule(response: CommercetoolsApprovalRule): ApprovalRule {
    return {
      key: response.key,
      approvalRuleVersion: response.version,
      approvalRuleId: response.id,
      approvers: this.commercetoolsApprovalRuleApproverToApprover(response.approvers),
      name: response.name,
      approvalRuleStatus: this.commercetoolsApprovalRuleStatusToApprovalRuleStatus(response.status),
      description: response.description,
      predicate: response.predicate,
      requesters: this.commercetoolsRuleRequesterToApprovalRuleRequester(response.requesters),
    };
  }

  static approvalRuleToCommercetoolsApprovalRuleDraft(approvalRule: ApprovalRule): CommerceToolsApprovalRuleDraft {
    return {
      key: approvalRule?.key,
      name: approvalRule.name,
      status: approvalRule.approvalRuleStatus,
      approvers: BusinessUnitMapper.approvalRuleApproverToCommercetoolsApprovalRuleApprover(approvalRule.approvers),
      predicate: approvalRule.predicate,
      requesters: BusinessUnitMapper.approvalRuleRequesterToCommercetoolsRuleRequester(approvalRule.requesters),
      description: approvalRule.description,
    };
  }

  private static commercetoolsApprovalRuleStatusToApprovalRuleStatus(
    status: CommercetoolsApprovalRuleStatus,
  ): ApprovalRuleStatus {
    switch (status) {
      case 'Active':
        return 'Active';
      case 'Inactive':
        return 'Inactive';
      default:
        return undefined;
    }
  }

  private static commercetoolsRuleRequesterToApprovalRuleRequester(
    requesters: CommercetoolsRuleRequester[],
  ): AssociateRole[] {
    return requesters.map((requester) => {
      return {
        key: requester.associateRole.key,
        typeId: requester.associateRole.typeId,
      };
    });
  }

  private static commercetoolsApprovalRuleApproverToApprover(
    approvers: CommercetoolsApproverHierarchy,
  ): ApproverHierarchy {
    return {
      tiers: approvers.tiers.map((tier) => ({
        and: tier.and.map((conjunction) => ({
          or: conjunction.or.map((approver) => ({
            key: approver.associateRole.key,
            typeId: approver.associateRole.typeId,
          })),
        })),
      })),
    };
  }

  static approvalRuleApproverToCommercetoolsApprovalRuleApprover(
    approvers: ApproverHierarchy,
  ): CommercetoolsApproverHierarchy {
    return {
      tiers: approvers.tiers.map((tier) => ({
        and: tier.and.map((conjunction) => ({
          or: conjunction.or.map((approver) => {
            return {
              associateRole: {
                typeId: 'associate-role',
                key: approver.key,
              },
            };
          }),
        })),
      })),
    };
  }

  static approvalRuleRequesterToCommercetoolsRuleRequester(requesters: AssociateRole[]): CommercetoolsRuleRequester[] {
    return requesters.map((requester) => {
      return {
        associateRole: {
          typeId: 'associate-role',
          key: requester.key,
        },
      };
    });
  }

  static commercetoolsApprovalFlowToApprovalFlow(
    commercetoolsApprovalFlow: CommercetoolsApprovalFlow,
    locale: Locale,
    defaultLocale: Locale,
  ): ApprovalFlow {
    return {
      approvalFlowId: commercetoolsApprovalFlow.id,
      approvalFlowVersion: commercetoolsApprovalFlow.version,
      order: this.commercetoolsOrderReferenceToOrder(commercetoolsApprovalFlow.order, locale, defaultLocale),
      businessUnitKey: commercetoolsApprovalFlow.businessUnit.key,
      approvalRules: commercetoolsApprovalFlow.rules.map((commercetoolsRule) => {
        return this.commercetoolsApprovalRuleToApprovalRule(commercetoolsRule);
      }),
      approvalFlowStatus: this.commercetoolsApprovalFlowStatusToApprovalFlowStatus(commercetoolsApprovalFlow.status),
      approvalFlowRejection: commercetoolsApprovalFlow.rejection
        ? {
            rejecter: this.commercetoolsAssociateToAssociate(commercetoolsApprovalFlow.rejection.rejecter),
            rejectedAt: commercetoolsApprovalFlow.rejection.rejectedAt
              ? new Date(commercetoolsApprovalFlow.rejection.rejectedAt)
              : undefined,
            reason: commercetoolsApprovalFlow.rejection.reason,
          }
        : undefined,
      approvalFlowApprovals: commercetoolsApprovalFlow.approvals.map((approval) => {
        return {
          approver: this.commercetoolsAssociateToAssociate(approval.approver),
          approvedAt: new Date(approval.approvedAt),
        };
      }),
      eligibleApprovers: commercetoolsApprovalFlow.eligibleApprovers.map((commercetoolsRuleApprover) => {
        return this.commercetoolsAssociateRoleKeyReferenceToAssociateRole(commercetoolsRuleApprover.associateRole);
      }),
      pendingApprovers: commercetoolsApprovalFlow.pendingApprovers.map((commercetoolsPendingApprover) => {
        return this.commercetoolsAssociateRoleKeyReferenceToAssociateRole(commercetoolsPendingApprover.associateRole);
      }),
      currentTierPendingApprovers: commercetoolsApprovalFlow.currentTierPendingApprovers.map(
        (commercetoolsCurrentTierPendingApprovers) => {
          return this.commercetoolsAssociateRoleKeyReferenceToAssociateRole(
            commercetoolsCurrentTierPendingApprovers.associateRole,
          );
        },
      ),
    };
  }

  static commercetoolsOrderReferenceToOrder(
    order: CommercetoolsOrderReference,
    locale: Locale,
    defaultLocale: Locale,
  ): Order {
    return {
      cartId: order?.id,
      ...(order?.obj ? CartMapper.commercetoolsOrderToOrder(order.obj, locale, defaultLocale) : {}),
    };
  }

  static commercetoolsAssociateToAssociate(commercetoolsAssociate: CommercetoolsAssociate): Associate {
    if (!commercetoolsAssociate.customer?.obj) {
      return {
        accountId: commercetoolsAssociate.customer.id,
      };
    }

    const account = AccountMapper.commercetoolsCustomerToAccount(commercetoolsAssociate.customer.obj);

    const roles =
      commercetoolsAssociate.associateRoleAssignments?.map((commercetoolsAssociateRoleAssignment) => {
        return this.commercetoolsAssociateRoleKeyReferenceToAssociateRole(
          commercetoolsAssociateRoleAssignment.associateRole,
        );
      }) || [];

    return {
      ...account,
      roles,
    };
  }

  private static commercetoolsApprovalFlowStatusToApprovalFlowStatus(
    status: CommercetoolsApprovalFlowStatus,
  ): ApprovalFlowStatus {
    switch (status) {
      case 'Pending':
        return 'Pending';
      case 'Approved':
        return 'Approved';
      case 'Rejected':
        return 'Rejected';
      default:
        return undefined;
    }
  }
}
