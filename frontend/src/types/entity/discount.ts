import { CartDiscount } from '@shared/types/cart';

type DiscountTargetType = 'lineItems';

export interface BaseDiscountTarget {
  type?: DiscountTargetType;
}

export interface LineItemDiscountTarget extends BaseDiscountTarget {
  type: 'lineItems';
  predicate: string;
}

export type DiscountTarget = LineItemDiscountTarget;

export interface Discount {
  discountCodeId: string;
  name: string;
  code: string;
  targets?: DiscountTarget[];
  discounts?: CartDiscount[];
}
