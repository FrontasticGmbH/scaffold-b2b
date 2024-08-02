import { TablePaginationProps } from '@/components/organisms/table/types';
import { ApprovalFlow } from '@/types/entity/approval-flow';

export interface Props {
  approvalFlows: ApprovalFlow[];
  pagination?: TablePaginationProps;
}
