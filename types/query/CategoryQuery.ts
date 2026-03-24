import { PaginatedQuery } from './PaginatedQuery';

export enum CategoryQueryFormat {
  FLAT = 'flat',
  TREE = 'tree',
}

export interface CategoryQuery extends PaginatedQuery {
  parentId?: string;
  slug?: string;
  format?: CategoryQueryFormat;
}
