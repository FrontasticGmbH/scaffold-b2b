import { Product, Category } from '../product';

export interface PaginatedResult<T> {
  total?: number;
  previousCursor?: string;
  nextCursor?: string;
  count: number;
  items: T[];
  query?: any;
}

export interface ProductPaginatedResult extends PaginatedResult<Product> {
  facets?: any[];
}

export interface CategoryPaginatedResult extends PaginatedResult<Category> {  
}
