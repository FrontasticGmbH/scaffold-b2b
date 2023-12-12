export interface PaginatedResult<T, U = T | undefined> {
  total?: number;
  previousCursor?: string;
  nextCursor?: string;
  count: number;
  items: T[] | U[];
  facets?: any[];
  query?: any;
}
