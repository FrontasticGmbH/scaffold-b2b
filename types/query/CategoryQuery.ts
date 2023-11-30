import { PaginatedQuery } from './PaginatedQuery';

export interface CategoryQuery extends PaginatedQuery {
  parentId?: string;
  slug?: string;
  format?: 'tree' | 'flat';
}
