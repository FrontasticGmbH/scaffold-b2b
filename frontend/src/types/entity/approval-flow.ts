import { ApprovalRule } from './approval-rule';
import { BusinessUnit } from './business-unit';
import { Order } from './order';

export interface Approver {
  key: string;
  name?: string;
}

export interface Approval {
  approvedAt: string;
  approver: Approver & { roles: Approver[] };
}

export interface Rejection {
  rejectedAt: string;
  reason: string;
  rejecter: Approver & { roles: Approver[] };
}

export type ApprovalFlowStatus = 'pending' | 'accepted' | 'rejected';

export interface ApprovalFlow {
  id: string;
  date: string;
  businessUnit: Partial<BusinessUnit>;
  status: ApprovalFlowStatus;
  rules?: ApprovalRule[];
  order?: Order;
  approvals: Array<Approval>;
  rejection?: Rejection;
  eligibleApprovers?: Array<Approver>;
  pendingApprovers?: Array<Approver>;
  currentPendingApproverTiers?: Array<Approver>;
}
