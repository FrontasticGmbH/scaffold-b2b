import { TablePaginationProps } from '@/components/organisms/table/types';
import { ApprovalRulesPageProps } from '../../types';

export interface Props extends Pick<ApprovalRulesPageProps, 'approvalRules' | 'onDuplicate' | 'viewOnly'> {
  pagination?: TablePaginationProps;
}
