import { OrderState, ShipmentState } from "@shared/types/cart";
import { OrderQuery } from "@shared/types/query";

type GetCartQuery = {
	businessUnitKey?: string;
	storeKey?: string;
};

type UpdateCartQuery = {
	businessUnitKey?: string;
	storeKey?: string;
};

type ReassignCartQuery = {
	businessUnitKey?: string;
	storeKey?: string;
};

type ReplicateOrderQuery = {
	businessUnitKey?: string;
	storeKey?: string;
};

type AddCartItemQuery = {
	businessUnitKey?: string;
	storeKey?: string;
};

type UpdateCartItemQuery = {
	businessUnitKey?: string;
	storeKey?: string;
};

type SplitCartItemQuery = {
	businessUnitKey?: string;
	storeKey?: string;
};

type RemoveCartItemQuery = {
	businessUnitKey?: string;
	storeKey?: string;
};

type GetCartShippingMethodsQuery = {
	businessUnitKey?: string;
	storeKey?: string;
	onlyMatching: boolean;
};

type GetAvailableCartShippingMethodsQuery = {
	businessUnitKey?: string;
	storeKey?: string;
};

type SetCartShippingMethodQuery = {
	businessUnitKey?: string;
	storeKey?: string;
};

type RedeemDiscountCodeQuery = {
	businessUnitKey?: string;
	storeKey?: string;
};

type RemoveDiscountCodeQuery = {
	businessUnitKey?: string;
	storeKey?: string;
};

type UpdatePaymentQuery = {
	businessUnitKey?: string;
	storeKey?: string;
};

type AddPaymentByInvoiceQuery = {
	businessUnitKey?: string;
	storeKey?: string;
};

type CheckoutCartQuery = {
	businessUnitKey?: string;
	storeKey?: string;
};

type ReturnOrderItemsQuery = {
	businessUnitKey?: string;
	storeKey?: string;
};

type CancelOrderQuery = {
	businessUnitKey?: string;
	storeKey?: string;
};

type QueryOrdersQuery = {
	limit?: number;
	cursor?: string;
	accountId?: string;
	orderIds?: string[];
	orderNumbers?: string[];
	orderState?: OrderState[];
	businessUnitKey?: string;
	shipmentState?: ShipmentState[];
	query?: string;
};

export {
	type GetCartQuery,
	type UpdateCartQuery,
	type ReassignCartQuery,
	type ReplicateOrderQuery,
	type AddCartItemQuery,
	type UpdateCartItemQuery,
	type SplitCartItemQuery,
	type RemoveCartItemQuery,
	type GetCartShippingMethodsQuery,
	type GetAvailableCartShippingMethodsQuery,
	type SetCartShippingMethodQuery,
	type RedeemDiscountCodeQuery,
	type RemoveDiscountCodeQuery,
	type UpdatePaymentQuery,
	type AddPaymentByInvoiceQuery,
	type CheckoutCartQuery,
	type ReturnOrderItemsQuery,
	type CancelOrderQuery,
	type QueryOrdersQuery,
};
