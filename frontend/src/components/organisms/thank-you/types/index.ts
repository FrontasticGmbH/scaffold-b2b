import { Currency } from '@/types/currency';
import { Address } from '@/types/entity/address';
import { Product } from '@/types/entity/product';

interface Transaction {
  subtotal: number;
  discounts: number;
  shipping: number;
  taxes: number;
  total: number;
  currency: Currency;
}

export interface ThankYouProps {
  account: { email: string };
  orderId?: string;
  orderNumber?: string;
  deliveryMethod?: string;
  deliveryAddress?: Address;
  paymentMethod?: string;
  billingAddress?: Address;
  onReviewOrderClick?: () => void;
  lineItems: Product[];
  transaction: Transaction;
  purchaseOrderNumber?: string;
}
