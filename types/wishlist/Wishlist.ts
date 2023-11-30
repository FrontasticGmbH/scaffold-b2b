import { Store } from '../store/Store';
import { LineItem } from './LineItem';

export interface Wishlist {
  wishlistId?: string;
  wishlistVersion?: string;
  accountId?: string;
  name?: string;
  description?: string;
  lineItems?: LineItem[];
  store?: Store;
}
