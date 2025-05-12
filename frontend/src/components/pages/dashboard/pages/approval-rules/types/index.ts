import { Option } from '@/components/atoms/select/types';
import { Criteria } from '@/components/organisms/rule-builder/types';
import { ApprovalRule } from '@/types/entity/approval-rule';

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
  onRowsPerPageChange: (rowsPerPage: string) => void;
}

export interface ApprovalRulesPageProps {
  viewOnly?: boolean;
  initialBusinessUnit?: string;
  businessUnitOptions: Option[];
  onBusinessUnitChange?: (businessUnit: string) => void;
  approvalRules: ApprovalRule[];
  loading?: boolean;
  roles: Option[];
  rulesCriteria: Criteria[];
  approversCriteria: Criteria[];
  pagination?: Pagination;
  onSubmit: (approvalRule: ApprovalRule) => Promise<boolean>;
  onDuplicate: (approvalRule: ApprovalRule) => Promise<boolean>;
  activeTab?: 'active' | 'inactive';
  onTabChange: (tab: 'active' | 'inactive') => void;
}
