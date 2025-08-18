import { RecurringOrderState } from '../cart';
import { PaginatedQuery, SortAttributes } from '../query';

export interface RecurrencePolicyQuery extends PaginatedQuery {
  recurrencePolicyIds?: string[];
  keys?: string[];
}

export interface RecurringOrderQuery extends PaginatedQuery {
  recurringOrderIds?: string[];
  recurringOrderStates?: RecurringOrderState[];
  businessUnitKey?: string;
  accountId?: string;
  startsAt?: string;
  createdAt?: string;
  sortAttributes?: SortAttributes
}

