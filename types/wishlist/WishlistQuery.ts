import { PaginatedQuery } from '../query';

export interface WishlistQuery extends PaginatedQuery {
  accountId: string;
  wishlistIds?: string[];
  name?: string;
  query?: string;
  storeKey?: string;
  businessUnitKey?: string;
}
