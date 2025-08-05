import { PaginatedQuery } from '../query';

export interface RecurrencePolicyQuery extends PaginatedQuery {
  recurrencePolicyIds?: string[];
  keys?: string[];
}
