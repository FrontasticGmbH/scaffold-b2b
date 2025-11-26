import { ProductDiscountedPrice, RecurrencePolicy } from '../cart';
import { Money } from './Money';

export interface Price {
  value: Money;
  discounted?: ProductDiscountedPrice;
  recurrencePolicy?: RecurrencePolicy;
}

