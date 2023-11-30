import { QuoteRequest } from './QuoteRequest';
import { LineItem } from '../cart/LineItem';
import { Money } from '../product/Money';
import { Tax } from '../cart/Tax';

export enum QuoteState {
  Accepted = 'Accepted', // Accepted by the buyer.
  Declined = 'Declined', // Declined by the buyer.
  DeclinedForRenegotiation = 'DeclinedForRenegotiation', // Declined by the buyer for renegotiation.
  RenegotiationAddressed = 'RenegotiationAddressed', // Renegotiation Addressed by the seller.
  Failed = 'Failed',
  Pending = 'Pending', // Pending for Acceptance / Decline by the buyer.
  Withdrawn = 'Withdrawn', // Withdrawn by the seller.
}

export interface Quote {
  quoteId?: string;
  key?: string;
  quoteState?: QuoteState;
  createdAt?: Date;
  lastModifiedAt?: Date;
  buyerComment?: string;
  sellerComment?: string;
  lineItems?: LineItem[];
  sum?: Money;
  tax?: Tax;
  expirationDate?: Date;
  quoteRequest?: QuoteRequest;
  quoteVersion?: number;
}
