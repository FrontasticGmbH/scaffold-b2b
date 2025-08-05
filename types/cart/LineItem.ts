import { DiscountedPricePerCount, ProductDiscountedPrice } from './Discount';
import { Variant } from '../product/Variant';
import { Money } from '../product/Money';
import { Tax } from './Tax';
import { TaxRate } from './TaxRate';
import { LineItemRecurrenceInfo } from './RecurringOrder';

export interface LineItemShippingAddress {
  addressKey: string;
  count: number;
}

export interface LineItem {
  lineItemId?: string;
  productId?: string;
  productSlug?: string;
  name?: string;
  type?: string;
  count?: number;
  price?: Money; // Price of a single item
  discountedPrice?: ProductDiscountedPrice; // Discounted price per item
  discountedPricePerCount?: DiscountedPricePerCount[];
  totalPrice?: Money;
  taxed?: Tax;
  taxRate?: TaxRate;
  variant?: Variant;
  isGift?: boolean;
  _url?: string;
  shippingDetails?: {
    shippingAddresses?: LineItemShippingAddress[];
    valid: boolean; // true if the quantity of the Line Item is equal to the sum of the sub-quantities in shippingAddresses, else it is false.
  };
  recurrenceInfo?: LineItemRecurrenceInfo;
}
