import { Address } from '@shared/types/account';
import { LineItem, Payment, ReturnLineItem } from '@shared/types/cart';

type UpdateCartPayload = {
  account?: { email: string };
  shipping?: Address;
  billing?: Address;
};

type ReassignCartPayload = {
  accountId?: string;
  email?: string;
};

type ReplicateOrderPayload = {
  orderId: string;
};

type AddCartItemPayload = {
  lineItems: LineItem[];
};

type UpdateCartItemPayload = {
  lineItem: { id: string; count?: number };
};

type SplitCartItemPayload = {
  lineItemId: string;
  shippingAddresses?: { address: Address; count: number }[];
};

type RemoveCartItemPayload = {
  lineItem: { id: string };
};
type SetCartShippingMethodPayload = {
  shippingMethod: { id: string };
};

type RedeemDiscountCodePayload = {
  code: string;
};

type RemoveDiscountCodePayload = {
  discountCodeId: string;
};

type UpdatePaymentPayload = {
  payment: Payment;
};

type AddPaymentByInvoicePayload = {
  payment: Payment;
};

type CheckoutCartPayload = {
  purchaseOrderNumber?: string;
};

type ReturnOrderItemsPayload = {
  orderId: string;
  returnLineItems: ReturnLineItem[];
};

type CancelOrderPayload = {
  orderId: string;
};

export {
  type UpdateCartPayload,
  type ReassignCartPayload,
  type ReplicateOrderPayload,
  type AddCartItemPayload,
  type UpdateCartItemPayload,
  type SplitCartItemPayload,
  type RemoveCartItemPayload,
  type SetCartShippingMethodPayload,
  type RedeemDiscountCodePayload,
  type RemoveDiscountCodePayload,
  type UpdatePaymentPayload,
  type AddPaymentByInvoicePayload,
  type CheckoutCartPayload,
  type ReturnOrderItemsPayload,
  type CancelOrderPayload,
};
