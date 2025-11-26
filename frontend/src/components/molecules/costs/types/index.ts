import { Currency } from '@/types/currency';
import { DiscountSegment } from '@/types/transaction';

export interface CostsProps {
  subtotal: number;
  discount: number;
  discountSegments?: DiscountSegment[];
  shipping?: number;
  tax?: number;
  isShippingEstimated?: boolean;
  shippingIncludesTaxes?: boolean;
  total: number;
  currency: Currency;
  loading?: boolean;
  fractionDigits?: number;
  classNames?: {
    container?: string;
    totalAmount?: string;
    subCostsContainer?: string;
    subCosts?: string;
  };
}
