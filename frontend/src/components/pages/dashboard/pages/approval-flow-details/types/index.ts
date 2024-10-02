import { Criteria } from '@/components/organisms/rule-builder/types';
import { ApprovalFlow, Approver } from '@/types/entity/approval-flow';

export interface ApprovalFlowDetailsPageProps {
  approvalFlow: ApprovalFlow;
  viewOnly?: boolean;
  userRoles: Approver[];
  approversCriteria?: Criteria[];
  onApprove?: () => Promise<boolean>;
  onReject?: (reason: string) => Promise<boolean>;
}
