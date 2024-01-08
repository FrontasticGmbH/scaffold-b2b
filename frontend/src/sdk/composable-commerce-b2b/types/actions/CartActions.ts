import { SDKResponse, ServerOptions } from "@commercetools/frontend-sdk";
import { Cart, Order, Payment, ShippingMethod } from "@shared/types/cart";
import { PaginatedResult } from "@shared/types/result";
import {
	UpdateCartPayload,
	ReassignCartPayload,
	AddCartItemPayload,
	UpdateCartItemPayload,
	SplitCartItemPayload,
	RemoveCartItemPayload,
	SetCartShippingMethodPayload,
	RedeemDiscountCodePayload,
	RemoveDiscountCodePayload,
	UpdatePaymentPayload,
	AddPaymentByInvoicePayload,
	CheckoutCartPayload,
	ReturnOrderItemsPayload,
	CancelOrderPayload,
} from "../payloads/CartPayloads";
import {
	GetCartQuery,
	UpdateCartQuery,
	ReassignCartQuery,
	ReplicateOrderQuery,
	AddCartItemQuery,
	UpdateCartItemQuery,
	SplitCartItemQuery,
	RemoveCartItemQuery,
	GetCartShippingMethodsQuery,
	GetAvailableCartShippingMethodsQuery,
	SetCartShippingMethodQuery,
	RedeemDiscountCodeQuery,
	RemoveDiscountCodeQuery,
	UpdatePaymentQuery,
	AddPaymentByInvoiceQuery,
	CheckoutCartQuery,
	ReturnOrderItemsQuery,
	CancelOrderQuery,
	QueryOrdersQuery,
} from "../queries/CartQueries";

type GetCartAction = (
	query?: GetCartQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Cart>>;

type UpdateCartAction = (
	payload: UpdateCartPayload,
	query?: UpdateCartQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Cart>>;

type ReassignCartAction = (
	payload: ReassignCartPayload,
	query?: ReassignCartQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Cart>>;

type ReplicateOrderAction = (
	query?: ReplicateOrderQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Order>>;

type AddCartItemAction = (
	payload: AddCartItemPayload,
	query?: AddCartItemQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Cart>>;

type UpdateCartItemAction = (
	payload: UpdateCartItemPayload,
	query?: UpdateCartItemQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Cart>>;

type SplitCartItemAction = (
	payload: SplitCartItemPayload,
	query?: SplitCartItemQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Cart>>;

type RemoveCartItemAction = (
	payload: RemoveCartItemPayload,
	query?: RemoveCartItemQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Cart>>;

type GetCartShippingMethodsAction = (
	query?: GetCartShippingMethodsQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<ShippingMethod[]>>;

type GetAvailableCartShippingMethodsAction = (
	query?: GetAvailableCartShippingMethodsQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<ShippingMethod[]>>;

type SetCartShippingMethodAction = (
	payload: SetCartShippingMethodPayload,
	query?: SetCartShippingMethodQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Cart>>;

type RedeemDiscountCodeAction = (
	payload: RedeemDiscountCodePayload,
	query?: RedeemDiscountCodeQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Cart>>;

type RemoveDiscountCodeAction = (
	payload: RemoveDiscountCodePayload,
	query?: RemoveDiscountCodeQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Cart>>;

type UpdatePaymentAction = (
	payload: UpdatePaymentPayload,
	query?: UpdatePaymentQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Payment>>;

type AddPaymentByInvoiceAction = (
	payload: AddPaymentByInvoicePayload,
	query?: AddPaymentByInvoiceQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Cart>>;

type CheckoutCartAction = (
	payload: CheckoutCartPayload,
	query?: CheckoutCartQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Order>>;

type ReturnOrderItemsAction = (
	payload: ReturnOrderItemsPayload,
	query?: ReturnOrderItemsQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Order>>;

type CancelOrderAction = (
	payload: CancelOrderPayload,
	query?: CancelOrderQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Order>>;

type QueryOrdersAction = (
	query?: QueryOrdersQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<PaginatedResult<Order>>>;

export {
	type GetCartAction,
	type UpdateCartAction,
	type ReassignCartAction,
	type ReplicateOrderAction,
	type AddCartItemAction,
	type UpdateCartItemAction,
	type SplitCartItemAction,
	type RemoveCartItemAction,
	type GetCartShippingMethodsAction,
	type GetAvailableCartShippingMethodsAction,
	type SetCartShippingMethodAction,
	type RedeemDiscountCodeAction,
	type RemoveDiscountCodeAction,
	type UpdatePaymentAction,
	type AddPaymentByInvoiceAction,
	type CheckoutCartAction,
	type ReturnOrderItemsAction,
	type CancelOrderAction,
	type QueryOrdersAction,
};
