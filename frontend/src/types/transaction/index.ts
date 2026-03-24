import { Currency } from '../currency';

export interface Transaction {
  subtotal: { centAmount: number; currencyCode: Currency; fractionDigits: number };
  discount: { centAmount: number; currencyCode: Currency; fractionDigits: number };
  tax: { centAmount: number; currencyCode: Currency; fractionDigits: number };
  shipping: { centAmount: number; currencyCode: Currency; fractionDigits: number; isEstimated?: boolean };
  total: { centAmount: number; currencyCode: Currency; fractionDigits: number };
}
