import { Currency } from '../currency';

export interface PurchaseListItem {
  id: string;
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
  store: string;
  description: string;
  items: PurchaseListItem[];
}
