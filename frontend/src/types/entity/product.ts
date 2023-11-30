import { Currency } from '../currency';

export interface Product {
  id: string;
  sku?: string;
  name: string;
  description?: string;
  model?: string;
  image?: string;
  price: number;
  discountedPrice?: number;
  currency: Currency;
  inStock?: boolean;
  quantity?: number;
  maxQuantity?: number;
  restockableInDays?: number;
}
