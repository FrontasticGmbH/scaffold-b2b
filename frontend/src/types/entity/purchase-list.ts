import { Account } from '@shared/types/account';
import { Currency } from '../currency';
import { Store } from './business-unit';
import { Attribute } from './product';

export interface PurchaseListItem {
  id: string;
  sku: string;
  url: string;
  name: string;
  model?: string;
  image?: string;
  price: number;
  currency: Currency;
  quantity: number;
  inStock?: boolean;
  maxQuantity?: number;
  specifications?: Attribute[];
}

export interface PurchaseList {
  id: string;
  name: string;
  store?: Store;
  description: string;
  items: PurchaseListItem[];
  businessUnitKey?: string;
  account?: Account;
  createdAt?: string;
}
