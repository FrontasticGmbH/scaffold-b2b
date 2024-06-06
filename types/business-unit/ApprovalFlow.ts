import { ApprovalRule } from './ApprovalRule';
import { Associate, AssociateRole } from './Associate';
import { Order } from '../cart';
import { PaginatedQuery } from '../query';
import { SortAttributes } from '../query/QuoteQuery';

export type ApprovalFlowStatus = 'Pending' | 'Approved' | 'Rejected';

export interface ApprovalFlowRejection {
  rejecter: Associate;
  rejectedAt: Date;
  reason?: string;
}

export interface ApprovalFlowApproval {
  approver: Associate;
  approvedAt: Date;
}

export interface ApprovalFlow {
  approvalFlowId: string;
  approvalFlowVersion?: number;
  order: Order;
  businessUnitKey: string;
  approvalRules: ApprovalRule[];
  approvalFlowStatus: ApprovalFlowStatus;
  approvalFlowRejection: ApprovalFlowRejection;
  approvalFlowApproval: ApprovalFlowApproval[];
  eligibleApprovers: AssociateRole[];
  pendingApprovers: AssociateRole[];
  currentTierPendingApprovers: AssociateRole[];
}

export interface ApprovalFlowsQuery extends PaginatedQuery {
  approvalFlowIds?: string[];
  approvalFlowStatus?: ApprovalFlowStatus[];
  approvalFlowRejection?: ApprovalFlowRejection[];
  sortAttributes?: SortAttributes;
}
