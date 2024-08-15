import { Option } from '@/components/atoms/select/types';
import { ApprovalFlow, ApprovalFlowStatus } from '@/types/entity/approval-flow';

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
  onRowsPerPageChange: (rowsPerPage: string) => void;
}

export interface ApprovalFlowsPageProps {
  initialBusinessUnit?: string;
  businessUnitOptions: Option[];
  onBusinessUnitChange?: (businessUnit: string) => void;
  onSearch: (val: string) => void;
  selectedStatus: ApprovalFlowStatus;
  onStatusSelectedChange: (status: ApprovalFlowStatus) => void;
  searchValue?: string;
  pagination: Pagination;
  approvalFlows: ApprovalFlow[];
  loading?: boolean;
}
