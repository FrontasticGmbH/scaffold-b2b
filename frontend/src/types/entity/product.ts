import { Currency } from '../currency';

export type Attribute = {
  label: string;
  value: string;
};

export type Category = { categoryId: string; name: string };

export interface Product {
  id: string;
  sku?: string;
  name: string;
  description?: string;
  model?: string;
  images?: string[];
  price: number;
  discountedPrice?: number;
  priceRange?: [number, number];
  currency: Currency;
  inStock?: boolean;
  quantity?: number;
  maxQuantity?: number;
  restockableInDays?: number;
  colors?: Array<Attribute>;
  specs?: Array<Attribute>;
  categories?: Array<Category>;
  url?: string;
}
