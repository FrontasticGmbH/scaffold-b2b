import { ApprovalRuleStatus } from '@shared/types/business-unit';

export interface useApprovalRulesOptions {
  businessUnitKey?: string;
  storeKey?: string;
  filters?: {
    ids?: Array<string>;
    statuses?: Array<ApprovalRuleStatus>;
    cursor?: string;
    limit?: number;
  };
}
