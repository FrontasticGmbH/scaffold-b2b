export interface useApprovalRulesOptions {
  businessUnitKey?: string;
  storeKey?: string;
  filters?: {
    cursor?: string;
    limit?: number;
  };
}
