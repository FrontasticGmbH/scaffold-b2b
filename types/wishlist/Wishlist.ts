import { Account } from '../account';
import { Store } from '../store/Store';
import { LineItem } from './LineItem';

export interface Wishlist {
  wishlistId?: string;
  wishlistVersion?: string;
  key?: string;
  slug?: string;
  account?: Account;
  name?: string;
  description?: string;
  lineItems?: LineItem[];
  store?: Store;
  businessUnitKey?: string;
  createdAt?: string;
}
