import { ProductDiscountedPrice } from '../cart';
import { Attributes } from './Attributes';
import { Money } from './Money';

export interface Variant {
  id?: string;
  sku: string;
  groupId?: string;
  price?: Money;
  discountedPrice?: ProductDiscountedPrice;
  attributes?: Attributes;
  images?: string[];
  isOnStock?: boolean;
  availableQuantity?: number;
  restockableInDays?: number;
  isMatchingVariant?: boolean;
}
