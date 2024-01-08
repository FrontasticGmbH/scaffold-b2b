import { Attributes } from './Attributes';
import { Money } from './Money';

export enum ProductDiscountType {
  ABSOLUTE = 'absolute',
  RELATIVE = 'relative',
}

export interface ProductDiscount {
  type?: ProductDiscountType;
  description?: string;
  value?: number | Money;
}

export interface Variant {
  id?: string;
  sku: string;
  groupId?: string;
  price?: Money;
  discountedPrice?: Money; // Discounted price
  discounts?: ProductDiscount[];
  attributes?: Attributes;
  images?: string[];
  isOnStock?: boolean;
  availableQuantity?: number;
  restockableInDays?: number;
}
