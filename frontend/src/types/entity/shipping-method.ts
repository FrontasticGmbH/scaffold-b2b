import { Currency } from '../currency';

export interface ShippingMethod {
  id: string;
  name: string;
  estimatedDeliveryDate?: string;
  price: number;
  currency: Currency;
}
