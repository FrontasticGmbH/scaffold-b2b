import { SDKResponse, ServerOptions } from '@commercetools/frontend-sdk';
import { Cart, Order, Payment, ShippingMethod } from '@shared/types/cart';
import { PaginatedResult } from '@shared/types/result';
import { Token } from '@shared/types/Token';
import {
  UpdateCartPayload,
  ReassignCartPayload,
  ReplicateOrderPayload,
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
} from '../payloads/CartPayloads';
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
} from '../queries/CartQueries';

type ClearCartAction = (options?: {
  /**
   * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
   */
  parallel?: boolean;
  /**
   * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
   */
  customHeaderValue?: string;
  /**
   * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
   */
  serverOptions?: ServerOptions;
}) => Promise<SDKResponse<void>>;

type GetCartAction = (
  query?: GetCartQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Cart>>;

type UpdateCartAction = (
  payload: UpdateCartPayload,
  query?: UpdateCartQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Cart>>;

type ReassignCartAction = (
  payload: ReassignCartPayload,
  query?: ReassignCartQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Cart>>;

type ReplicateOrderAction = (
  payload: ReplicateOrderPayload,
  query?: ReplicateOrderQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Order>>;

type AddCartItemAction = (
  payload: AddCartItemPayload,
  query?: AddCartItemQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Cart>>;

type UpdateCartItemAction = (
  payload: UpdateCartItemPayload,
  query?: UpdateCartItemQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Cart>>;

type SplitCartItemAction = (
  payload: SplitCartItemPayload,
  query?: SplitCartItemQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Cart>>;

type RemoveCartItemAction = (
  payload: RemoveCartItemPayload,
  query?: RemoveCartItemQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Cart>>;

type GetCartShippingMethodsAction = (
  query?: GetCartShippingMethodsQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<ShippingMethod[]>>;

type GetAvailableCartShippingMethodsAction = (
  query?: GetAvailableCartShippingMethodsQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<ShippingMethod[]>>;

type SetCartShippingMethodAction = (
  payload: SetCartShippingMethodPayload,
  query?: SetCartShippingMethodQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Cart>>;

type RedeemDiscountCodeAction = (
  payload: RedeemDiscountCodePayload,
  query?: RedeemDiscountCodeQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Cart>>;

type RemoveDiscountCodeAction = (
  payload: RemoveDiscountCodePayload,
  query?: RemoveDiscountCodeQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Cart>>;

type UpdatePaymentAction = (
  payload: UpdatePaymentPayload,
  query?: UpdatePaymentQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Payment>>;

type AddPaymentByInvoiceAction = (
  payload: AddPaymentByInvoicePayload,
  query?: AddPaymentByInvoiceQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Cart>>;

type CheckoutCartAction = (
  payload: CheckoutCartPayload,
  query?: CheckoutCartQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Order>>;

type ReturnOrderItemsAction = (
  payload: ReturnOrderItemsPayload,
  query?: ReturnOrderItemsQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Order>>;

type CancelOrderAction = (
  payload: CancelOrderPayload,
  query?: CancelOrderQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Order>>;

type QueryOrdersAction = (
  query?: QueryOrdersQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<PaginatedResult<Order>>>;

type GetCheckoutSessionTokenAction = (options?: {
  /**
   * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
   */
  parallel?: boolean;
  /**
   * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
   */
  customHeaderValue?: string;
  /**
   * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
   */
  serverOptions?: ServerOptions;
}) => Promise<SDKResponse<Token>>;

export {
  type ClearCartAction,
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
  type GetCheckoutSessionTokenAction,
};
