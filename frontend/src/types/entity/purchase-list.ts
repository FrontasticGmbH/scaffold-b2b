import { Account } from '@shared/types/account';
import { Currency } from '../currency';
import { Store } from './business-unit';

export interface PurchaseListItem {
  id: string;
  sku: string;
  url: string;
  name: string;
  model?: string;
  manufacturer?: string;
  image?: string;
  partNumber?: string;
  pressure?: string;
  weight?: string;
  price: number;
  currency: Currency;
  quantity: number;
  inStock?: boolean;
  maxQuantity?: number;
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
