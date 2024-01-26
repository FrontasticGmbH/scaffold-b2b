import { Currency } from '../currency';
import { Product } from './product';

export type OrderStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Returned' | 'Delivered';

export interface Order {
  id: string;
  status: OrderStatus;
  creationDate: string;
  businessUnit: string;
  items: Partial<Product>[];
  total: number;
  subtotal: number;
  shippingCosts?: number;
  taxCosts?: number;
  currency: Currency;
  shippingAddress?: string;
  billingAddress?: string;
  shippingMethod?: string;
  paymentMethod?: string;
}
