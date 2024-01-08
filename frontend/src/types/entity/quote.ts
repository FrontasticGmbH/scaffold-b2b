import { Currency } from '../currency';
import { Product } from './product';

export type QuoteStatus =
  | 'accepted'
  | 'inprogress'
  | 'withdrawn'
  | 'declined'
  | 'renegotiating'
  | 'submitted'
  | 'cancelled'
  | 'rejected'
  | 'sent'
  | 'closed'
  | 'waiting';

export interface QuoteActivity {
  title: string;
  date?: string;
  author?: string;
  comment?: string;
  commentBy?: 'author' | 'seller';
  reply?: boolean;
  renegotiate?: boolean;
  revoke?: boolean;
}

export interface Quote {
  id: string;
  status: QuoteStatus;
  creationDate: string;
  businessUnit: string;
  items: Partial<Product>[];
  activity: QuoteActivity[];
  total: number;
  subtotal: number;
  shippingCosts?: number;
  taxCosts?: number;
  currency: Currency;
  isNew?: boolean;
  shippingAddress?: string;
  billingAddress?: string;
  shippingMethod?: string;
  paymentMethod?: string;
}
