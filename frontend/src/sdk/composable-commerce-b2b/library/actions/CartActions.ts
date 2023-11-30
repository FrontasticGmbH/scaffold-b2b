import { ComposableCommerceEventsB2B } from "../../types/events/ComposableCommerceEventsB2B";
import { SDK, ServerOptions } from "@commercetools/frontend-sdk";
import {
	GetCartAction,
	UpdateCartAction,
	ReassignCartAction,
	ReplicateOrderAction,
	AddCartItemAction,
	UpdateCartItemAction,
	SplitCartItemAction,
	RemoveCartItemAction,
	GetCartShippingMethodsAction,
	GetAvailableCartShippingMethodsAction,
	SetCartShippingMethodAction,
	RedeemDiscountCodeAction,
	RemoveDiscountCodeAction,
	UpdatePaymentAction,
	AddPaymentByInvoiceAction,
	CheckoutCartAction,
	ReturnOrderItemsAction,
	CancelOrderAction,
	QueryOrdersAction,
} from "../../types/actions/CartActions";
import { Cart, Order, Payment, ShippingMethod } from "@shared/types/cart";
import {
	AddCartItemPayload,
	AddPaymentByInvoicePayload,
	CancelOrderPayload,
	CheckoutCartPayload,
	ReassignCartPayload,
	RedeemDiscountCodePayload,
	RemoveCartItemPayload,
	RemoveDiscountCodePayload,
	ReturnOrderItemsPayload,
	SetCartShippingMethodPayload,
	SplitCartItemPayload,
	UpdateCartItemPayload,
	UpdateCartPayload,
	UpdatePaymentPayload,
} from "../../types/payloads/CartPayloads";
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
} from "../../types/queries/CartQueries";
import { PaginatedResult } from "@shared/types/result";

export type CartActions = {
	getCart: GetCartAction;
	updateCart: UpdateCartAction;
	reassignCart: ReassignCartAction;
	replicateOrder: ReplicateOrderAction;
	addItem: AddCartItemAction;
	updateItem: UpdateCartItemAction;
	splitItem: SplitCartItemAction;
	removeItem: RemoveCartItemAction;
	getShippingMethods: GetCartShippingMethodsAction;
	getAvailableShippingMethods: GetAvailableCartShippingMethodsAction;
	setShippingMethod: SetCartShippingMethodAction;
	redeemDiscountCode: RedeemDiscountCodeAction;
	removeDiscountCode: RemoveDiscountCodeAction;
	updatePayment: UpdatePaymentAction;
	addPaymentByInvoice: AddPaymentByInvoiceAction;
	checkout: CheckoutCartAction;
	returnOrderItems: ReturnOrderItemsAction;
	cancelOrder: CancelOrderAction;
	queryOrders: QueryOrdersAction;
};

export const getCartActions = (
	sdk: SDK<ComposableCommerceEventsB2B>
): CartActions => {
	return {
		getCart: async (
			query?: GetCartQuery,
			options?: { serverOptions?: ServerOptions }
		) => {
			const response = await sdk.callAction<Cart>({
				actionName: "cart/getCart",
				serverOptions: options?.serverOptions,
				query,
			});
			return response;
		},
		updateCart: async (
			payload: UpdateCartPayload,
			query?: UpdateCartQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<Cart>({
				actionName: "cart/updateCart",
				payload,
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		reassignCart: async (
			payload: ReassignCartPayload,
			query?: ReassignCartQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<Cart>({
				actionName: "cart/reassignCart",
				payload,
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		replicateOrder: async (
			query?: ReplicateOrderQuery,
			options?: { serverOptions?: ServerOptions }
		) => {
			const response = await sdk.callAction<Cart>({
				actionName: "cart/replicateCart",
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		addItem: async (
			payload: AddCartItemPayload,
			query?: AddCartItemQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<Cart>({
				actionName: "cart/addToCart",
				payload,
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		updateItem: async (
			payload: UpdateCartItemPayload,
			query?: UpdateCartItemQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<Cart>({
				actionName: "cart/updateLineItem",
				payload,
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		splitItem: async (
			payload: SplitCartItemPayload,
			query?: SplitCartItemQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<Cart>({
				actionName: "cart/splitLineItem",
				payload,
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		removeItem: async (
			payload: RemoveCartItemPayload,
			query?: RemoveCartItemQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<Cart>({
				actionName: "cart/removeLineItem",
				payload,
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		getShippingMethods: async (
			query?: GetCartShippingMethodsQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<ShippingMethod[]>({
				actionName: "cart/getShippingMethods",
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		getAvailableShippingMethods: async (
			query?: GetAvailableCartShippingMethodsQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<ShippingMethod[]>({
				actionName: "cart/getAvailableShippingMethods",
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		setShippingMethod: async (
			payload: SetCartShippingMethodPayload,
			query?: SetCartShippingMethodQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<Cart>({
				actionName: "cart/setShippingMethod",
				payload,
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		redeemDiscountCode: async (
			payload: RedeemDiscountCodePayload,
			query?: RedeemDiscountCodeQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<Cart>({
				actionName: "cart/redeemDiscount",
				payload,
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		removeDiscountCode: async (
			payload: RemoveDiscountCodePayload,
			query?: RemoveDiscountCodeQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<Cart>({
				actionName: "cart/removeDiscount",
				payload,
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		updatePayment: async (
			payload: UpdatePaymentPayload,
			query?: UpdatePaymentQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<Payment>({
				actionName: "cart/updatePayment",
				payload,
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		addPaymentByInvoice: async (
			payload: AddPaymentByInvoicePayload,
			query?: AddPaymentByInvoiceQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<Cart>({
				actionName: "cart/addPaymentByInvoice",
				payload,
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		checkout: async (
			payload: CheckoutCartPayload,
			query?: CheckoutCartQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<Order>({
				actionName: "cart/checkout",
				payload,
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		returnOrderItems: async (
			payload: ReturnOrderItemsPayload,
			query?: ReturnOrderItemsQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<Order>({
				actionName: "cart/returnItems",
				payload,
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		cancelOrder: async (
			payload: CancelOrderPayload,
			query?: CancelOrderQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<Order>({
				actionName: "cart/cancelOrder",
				payload,
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		queryOrders: async (
			query?: QueryOrdersQuery,
			options: {
				serverOptions?: ServerOptions;
			} = {}
		) => {
			const response = await sdk.callAction<PaginatedResult<Order>>({
				actionName: "cart/queryOrders",
				query,
				serverOptions: options.serverOptions,
			});
			return response;
		},
	};
};
