import { Currency } from '../currency';

export type DiscountType = 'absolute' | 'relative' | 'fixed' | 'giftLineItem' | 'external';

export type DiscountSegment = {
  source?: string;
  label: string;
  value: { type: DiscountType; value: number };
  discountedAmount: number;
  targetsShipping?: boolean;
  targetsTotal?: boolean;
};

export interface Transaction {
  subtotal: { centAmount: number; currencyCode: Currency; fractionDigits: number };
  discount: {
    centAmount: number;
    currencyCode: Currency;
    fractionDigits: number;
    segments: DiscountSegment[];
  };
  tax: { centAmount?: number; currencyCode: Currency; fractionDigits: number };
  shipping: {
    centAmount?: number;
    currencyCode: Currency;
    fractionDigits: number;
    isEstimated?: boolean;
    freeAbove?: number;
    includesTaxes?: boolean;
  };
  total: { centAmount: number; currencyCode: Currency; fractionDigits: number };
}
