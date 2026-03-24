import { Currency } from '@/types/currency';

export interface CostsProps {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  isShippingEstimated?: boolean;
  total: number;
  currency: Currency;
  loading?: boolean;
  classNames?: {
    container?: string;
    totalAmount?: string;
    subCostsContainer?: string;
    subCosts?: string;
  };
}
