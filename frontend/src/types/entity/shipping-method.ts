import { Currency } from '../currency';

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  estimatedDeliveryDate?: string;
  price: number;
  currency: Currency;
  freeAbove?: number;
}
