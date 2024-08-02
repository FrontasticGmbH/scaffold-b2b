import { ApprovalFlowStatus } from '@shared/types/business-unit';

export interface ApprovalFlowsFilters {
  searchQuery?: string;
  status?: ApprovalFlowStatus;
  cursor?: string;
}

export interface UseApprovalFlowsOptions {
  businessUnitKey?: string;
  filters?: ApprovalFlowsFilters;
}
