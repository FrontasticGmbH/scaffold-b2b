import { PaginatedQuery } from './PaginatedQuery';
import { QuoteState } from '../quote/Quote';
import { QuoteRequestState } from '../quote/QuoteRequest';

export enum SortOrder {
  ASCENDING = 'ascending',
  DESCENDING = 'descending',
}

export interface SortAttributes {
  [key: string]: any;
}

export interface QuoteQuery extends PaginatedQuery {
  accountId: string;
  quoteIds?: string[];
  quoteStates?: (QuoteState | QuoteRequestState)[];
  sortAttributes?: SortAttributes;
  query?: string;
}
