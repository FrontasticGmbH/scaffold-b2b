import { ShippingMethod } from './ShippingMethod';
import { Money } from '../product/Money';
import { Tax } from './Tax';

export interface ShippingInfo extends ShippingMethod {
  price?: Money;
  taxed?: Tax;
  taxIncludedInPrice?: boolean;
}
