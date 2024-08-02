import { AssociateRole } from './Associate';
import { PaginatedQuery } from '../query';
import { SortAttributes } from '../query/QuoteQuery';

export type ApprovalRuleStatus = 'Active' | 'Inactive';

export interface ApproverHierarchy {
  tiers: ApproverConjunction[];
}

export interface ApproverConjunction {
  and: ApproverDisjunction[];
}

export interface ApproverDisjunction {
  or: AssociateRole[];
}

export interface ApprovalRule {
  approvalRuleId?: string;
  approvalRuleVersion?: number;
  key?: string;
  name: string;
  description?: string;
  approvalRuleStatus?: ApprovalRuleStatus;
  predicate: string;
  approvers: ApproverHierarchy;
  requesters: AssociateRole[];
}

export interface ApprovalRuleQuery extends PaginatedQuery {
  approvalRuleIds?: string[];
  approvalRuleStatus?: ApprovalRuleStatus[];
  sortAttributes?: SortAttributes;
}
