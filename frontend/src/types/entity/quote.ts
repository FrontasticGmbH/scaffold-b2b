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
  titleValues?: Record<string, string>;
  date?: string;
  author?: string;
  comment?: string;
  commentBy?: 'author' | 'seller';
  reply?: boolean;
  renegotiate?: boolean;
  revoke?: boolean;
  checkout?: boolean;
  viewOrder?: boolean;
}

export interface Quote {
  id: string;
  author?: string;
  status: QuoteStatus;
  creationDate: string;
  lastModifiedDate: string;
  businessUnit: string;
  items: Partial<Product>[];
  activity: QuoteActivity[];
  total: number;
  subtotal: number;
  shippingCosts?: number;
  discount?: number;
  taxCosts?: number;
  currency: Currency;
  isNew?: boolean;
  shippingAddress?: string;
  billingAddress?: string;
  shippingMethod?: string;
  paymentMethod?: string;
}
