import { Discount } from './Discount';
import { Variant } from '../product/Variant';
import { Money } from '../product/Money';

export interface LineItemShippingAddress {
  addressKey: string;
  count: number;
}

export interface LineItem {
  lineItemId?: string;
  productId?: string;
  name?: string;
  type?: string;
  count?: number;
  price?: Money; // Price of a single item
  discountedPrice?: Money; // Discounted price per item
  discountTexts?: string[]; // Discount texts, if any applied
  discounts?: Discount[];
  totalPrice?: Money;
  variant?: Variant;
  isGift?: boolean;
  _url?: string;
  shippingDetails?: {
    shippingAddresses?: LineItemShippingAddress[];
    valid: boolean; // true if the quantity of the Line Item is equal to the sum of the sub-quantities in shippingAddresses, else it is false.
  };
}
