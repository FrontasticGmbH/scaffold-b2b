import { PaginatedQuery } from './PaginatedQuery';
import { QuoteRequestState, QuoteState } from '../quote';

export enum SortOrder {
  ASCENDING = 'ascending',
  DESCENDING = 'descending',
}

export interface SortAttributes {
  [key: string]: any;
}

export interface QuoteQuery extends PaginatedQuery {
  accountId?: string;
  quoteIds?: string[];
  quoteStates?: (QuoteState | QuoteRequestState)[];
  sortAttributes?: SortAttributes;
  query?: string;
}
