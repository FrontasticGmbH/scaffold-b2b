import { Address } from '@shared/types/account';
import { ApprovalRule, ApprovalRuleStatus, ApproverHierarchy, AssociateRole } from '@shared/types/business-unit';

type CreateBusinessUnitPayload = {
  account: {
    accountId: string;
    email: string;
    companyName: string;
  };
};

type UpdateBusinessUnitPayload = {
  name?: string;
  contactEmail?: string;
};

type AddAssociatePayload = {
  email: string;
  roleKeys: string[];
};

type UpdateAssociatePayload = {
  accountId: string;
  roleKeys: string[];
};

type RemoveAssociatePayload = {
  accountId: string;
};

type AddBusinessUnitAddressPayload = {
  address: Address;
};

type UpdateBusinessUnitAddressPayload = {
  address: Address;
};

type RemoveBusinessUnitAddressPayload = {
  addressId: string;
};

type CreateApprovalRulePayload = {
  approvalRule: ApprovalRule;
};

type UpdateApprovalRulePayload = {
  approvalRule: {
    approvalRuleId: string;
    key?: string;
    name?: string;
    description?: string;
    approvalRuleStatus?: ApprovalRuleStatus;
    predicate?: string;
    approvers?: ApproverHierarchy;
    requesters?: AssociateRole[];
  };
};

type ApproveApprovalFlowPayload = {
  approvalFlowId: string;
};

type RejectApprovalFlowPayload = {
  approvalFlowId: string;
  reason: string;
};

export {
  type CreateBusinessUnitPayload,
  type UpdateBusinessUnitPayload,
  type AddAssociatePayload,
  type UpdateAssociatePayload,
  type RemoveAssociatePayload,
  type AddBusinessUnitAddressPayload,
  type UpdateBusinessUnitAddressPayload,
  type RemoveBusinessUnitAddressPayload,
  type CreateApprovalRulePayload,
  type UpdateApprovalRulePayload,
  type ApproveApprovalFlowPayload,
  type RejectApprovalFlowPayload,
};
