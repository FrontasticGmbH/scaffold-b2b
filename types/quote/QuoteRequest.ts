import { Account } from '../account/Account';
import { Address } from '../account/Address';
import { BusinessUnit } from '../business-unit/BusinessUnit';
import { Money } from '../product/Money';
import { Store } from '../store/Store';
import { LineItem } from '../cart/LineItem';
import { Tax } from '../cart/Tax';
import { Cart } from '../cart/Cart';

export enum QuoteRequestState {
  Accepted = 'Accepted', // Accepted by the seller.
  Cancelled = 'Cancelled', // Cancelled / Withdrawn by the buyer.
  Closed = 'Closed', // No further action that can be performed by any party.
  Rejected = 'Rejected', // Rejected by the seller.
  Submitted = 'Submitted', // Submitted by the buyer.
}

export interface QuoteRequest {
  quoteRequestId?: string;
  key?: string;
  createdAt?: Date;
  lastModifiedAt?: Date;
  account?: Account;
  buyerComment?: string;
  store?: Store;
  businessUnit?: BusinessUnit;
  lineItems?: LineItem[];
  sum?: Money;
  // @deprecated use taxed instead
  tax?: Tax;
  taxed?: Tax;
  shippingAddress?: Address;
  billingAddress?: Address;
  quoteRequestState?: QuoteRequestState;
  itemShippingAddresses?: Address[];
  // @deprecated
  expirationDate?: Date;
  quotationCart?: Cart;
  quoteRequestVersion?: number;
}
