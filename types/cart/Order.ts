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

export enum ShipmentState {
  Backorder = 'Backorder',
  Delayed = 'Delayed',
  Delivered = 'Delivered',
  Partial = 'Partial',
  Pending = 'Pending',
  Ready = 'Ready',
  Shipped = 'Shipped',
}

export interface Order extends Cart {
  orderId?: string;
  orderVersion?: string;
  orderNumber?: string;
  orderState?: OrderState;
  createdAt?: Date;
  businessUnitKey?: string;
  returnInfo?: ReturnInfo[];
  purchaseOrderNumber?: string;
  quoteId?: string;
  shipmentState?: ShipmentState;
}
