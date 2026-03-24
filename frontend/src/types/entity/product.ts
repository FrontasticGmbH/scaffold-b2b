import { Currency } from '../currency';
import { Category } from './category';

export type Attribute = {
  label: string;
  value: string;
};

export interface Product {
  id: string;
  key?: string;
  ref?: string;
  sku?: string;
  name: string;
  description?: string;
  specifications?: Array<Attribute>;
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
  models?: Array<number>;
  specs?: Array<Attribute>;
  categories?: Array<Category>;
  url?: string;
}
