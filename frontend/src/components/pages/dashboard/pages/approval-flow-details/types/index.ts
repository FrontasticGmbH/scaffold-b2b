import { ApprovalFlow, Approver } from '@/types/entity/approval-flow';

export interface ApprovalFlowDetailsPageProps {
  approvalFlow: ApprovalFlow;
  viewOnly?: boolean;
  userRoles: Approver[];
  onApprove?: () => Promise<boolean>;
  onReject?: (reason: string) => Promise<boolean>;
}
