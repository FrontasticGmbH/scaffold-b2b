import { Option } from '@/components/atoms/select/types';
import { ApprovalFlow, ApprovalFlowStatus } from '@/types/entity/approval-flow';
import { BusinessUnit } from '@/types/entity/business-unit';

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
  onRowsPerPageChange: (rowsPerPage: string) => void;
}

export interface ApprovalFlowsPageProps {
  selectedBusinessUnit?: BusinessUnit;
  businessUnitIsLoading?: boolean;
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
