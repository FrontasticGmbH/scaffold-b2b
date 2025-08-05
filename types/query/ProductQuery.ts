import { Filter } from './Filter';
import { PaginatedQuery } from './PaginatedQuery';
import { Facet } from './Facet';
import { Store } from '../store/Store';

export enum SortOrder {
  ASCENDING = 'ascending',
  DESCENDING = 'descending',
}

export interface SortAttributes {
  [key: string]: any;
}

export interface LocalizedString {
  [key: string]: string;
}

export interface ProductQuery extends PaginatedQuery {
  categories?: string[];
  productIds?: string[];
  productKeys?: string[];
  productRefs?: string[];
  productTypeId?: string;
  skus?: string[];
  query?: string | LocalizedString;
  filters?: Filter[];
  facets?: Facet[];
  sortAttributes?: SortAttributes;
  storeRef?: string;
  store?: Store;
  distributionChannelId?: string;
  supplyChannelId?: string;
  productSelectionId?: string;
  accountGroupIds?: string[];
}
