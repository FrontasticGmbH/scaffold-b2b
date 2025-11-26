import { Currency } from '../currency';
import { Category } from './category';

export type Attribute = {
  label: string;
  value: string;
};

export type DiscountCode = {
  name: string;
  code: string;
};

export type PerCountDiscount = {
  count: number;
  details: {
    totalDiscountedPrice: number;
    includedDiscounts: Array<{
      discountedAmount: number;
      discount: {
        cartDiscountId: string;
        name: string;
        description: string;
      };
    }>;
  };
};

export type ProductDiscount = {
  name: string;
  description: string;
  type?: 'relative' | 'absolute';
  value?: number;
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
  discountPercentage?: number;
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
  isGift?: boolean;
  discountCode?: DiscountCode;
  discount?: ProductDiscount;
  discountsAppliedPerCount?: Array<PerCountDiscount>;
}
