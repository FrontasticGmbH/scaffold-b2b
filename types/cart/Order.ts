import { Cart } from './Cart';

export interface ReturnLineItem {
  returnLineItemId?: string;
  lineItemId: string;
  count: number;
  comment?: string;
  createdAt?: Date;
}

export interface ReturnInfo {
  lineItems: ReturnLineItem[];
  returnDate?: Date;
  returnTrackingId?: string;
}

export enum OrderState {
  Cancelled = 'Cancelled',
  Complete = 'Complete',
  Confirmed = 'Confirmed',
  Open = 'Open',
}

export interface Order extends Cart {
  orderId?: string;
  orderVersion?: string;
  orderState?: OrderState;
  createdAt?: Date;
  businessUnitKey?: string;
  returnInfo?: ReturnInfo[];
  purchaseOrderNumber?: string;
}
