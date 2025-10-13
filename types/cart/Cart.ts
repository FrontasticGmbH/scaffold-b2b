import { ShippingMethod } from './ShippingMethod';
import { LineItem } from './LineItem';
import { Address, AccountGroup } from '../account';
import { Payment } from './Payment';
import { DirectDiscount, DiscountCode, DiscountOnTotalPrice } from './Discount';
import { Tax } from './Tax';
import { ShippingInfo } from './ShippingInfo';
import { Money } from '../product';

export enum CartOrigin {
  Customer = 'Customer',
  Merchant = 'Merchant',
  Quote = 'Quote',
  RecurringOrder = 'RecurringOrder',
}

export enum CartState {
  Active = 'Active',
  Frozen = 'Frozen',
  Merged = 'Merged',
  Ordered = 'Ordered',
}

export interface Cart {
  cartId: string;
  cartVersion?: string;
  lineItems?: LineItem[];
  totalLineItemQuantity?: number;
  email?: string;
  shippingInfo?: ShippingInfo; // Info of the shipping method selected by the customer
  availableShippingMethods?: ShippingMethod[]; // Available shipping methods for this cart
  shippingAddress?: Address;
  billingAddress?: Address;
  itemShippingAddresses?: Address[];
  sum?: Money;
  payments?: Payment[];
  discountCodes?: DiscountCode[];
  directDiscounts?: DirectDiscount[];
  taxed?: Tax;
  origin?: CartOrigin;
  cartState?: CartState;
  accountId?: string;
  businessUnitKey?: string;
  storeKey?: string;
  discountOnTotalPrice?: DiscountOnTotalPrice;
  accountGroup?: AccountGroup;
}
