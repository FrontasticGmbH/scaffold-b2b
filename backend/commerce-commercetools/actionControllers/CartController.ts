import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { LineItem } from '@Types/cart/LineItem';
import { OrderState, ReturnLineItem } from '@Types/cart/Order';
import { Cart } from '@Types/cart/Cart';
import { Address } from '@Types/account/Address';
import { DiscountCode, ShippingMethod } from '@Types/cart';
import { Payment, PaymentStatuses } from '@Types/cart/Payment';
import { Token } from '@Types/Token';
import { RecurrencePolicyQuery } from '@Types/query';
import { EmailApiFactory } from '../utils/EmailApiFactory';
import { CartFetcher } from '../utils/CartFetcher';
import { getLocale } from '../utils/requestHandlers/Request';
import handleError from '@Commerce-commercetools/utils/handleError';
import { OrderQueryFactory } from '@Commerce-commercetools/utils/OrderQueryFactory';
import { ValidationError } from '@Commerce-commercetools/errors/ValidationError';
import parseRequestBody from '@Commerce-commercetools/utils/requestHandlers/parseRequestBody';
import getCartApi from '@Commerce-commercetools/utils/apiFactories/getCartApi';
import queryParamsToIds from '@Commerce-commercetools/utils/requestHandlers/queryParamsToIds';
import { RecurringOrderFactory } from '@Commerce-commercetools/utils/RecurringOrderQueryFactory';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

async function updateCartFromRequest(request: Request, actionContext: ActionContext): Promise<Cart> {
  const cartApi = getCartApi(request, actionContext.frontasticContext);

  let cart = await CartFetcher.fetchCart(request, actionContext.frontasticContext);

  if (request?.body === undefined || request?.body === '') {
    return cart;
  }

  const body = parseRequestBody<{
    account?: { email?: string };
    shipping?: Address;
    billing?: Address;
  }>(request.body);

  if (body?.account?.email !== undefined) {
    cart = await cartApi.setEmail(cart, body.account.email);
  }

  if (body?.shipping !== undefined || body?.billing !== undefined) {
    const shippingAddress = body?.shipping !== undefined ? body.shipping : body.billing;
    const billingAddress = body?.billing !== undefined ? body.billing : body.shipping;

    cart = await cartApi.setShippingAddress(cart, shippingAddress);
    cart = await cartApi.setBillingAddress(cart, billingAddress);
  }

  return cart;
}

export const getCart: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cart = await CartFetcher.fetchActiveCartFromSession(request, actionContext.frontasticContext);

    return {
      statusCode: 200,
      body: cart ? JSON.stringify(cart) : '',
      sessionData: {
        ...request.sessionData,
        ...(cart ? { cartId: cart.cartId } : {}),
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const clearCart: ActionHook = async (request: Request) => {
  return {
    statusCode: 200,
    body: JSON.stringify({}),
    sessionData: {
      ...request.sessionData,
      cartId: undefined,
    },
  } as Response;
};

export const addToCart: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);

    const body = parseRequestBody<{
      lineItems: LineItem[];
    }>(request.body);

    let cart = await CartFetcher.fetchCart(request, actionContext.frontasticContext);

    cart = await cartApi.addToCart(cart, body.lineItems);

    const cartId = cart.cartId;

    return {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...request.sessionData,
        cartId,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const updateLineItem: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);

    const body = parseRequestBody<{ lineItem?: { id?: string; count: number } }>(request.body);

    const lineItem: LineItem = {
      lineItemId: body.lineItem?.id,
      count: +body.lineItem?.count || 1,
    };

    let cart = await CartFetcher.fetchCart(request, actionContext.frontasticContext);
    cart = await cartApi.updateLineItems(cart, [lineItem]);

    const cartId = cart.cartId;

    return {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...request.sessionData,
        cartId,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const returnItems: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);

    const body = parseRequestBody<{
      orderId: string;
      returnLineItems: ReturnLineItem[];
    }>(request.body);

    const res = await cartApi.returnItems(body.orderId, body.returnLineItems);
    return {
      statusCode: 200,
      body: JSON.stringify(res),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const cancelOrder: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);

    const body = parseRequestBody<{
      orderId: string;
    }>(request.body);

    const res = await cartApi.updateOrderState(body.orderId, OrderState.Cancelled);

    return {
      statusCode: 200,
      body: JSON.stringify(res),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const replicateOrder: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);

    const body = parseRequestBody<{ orderId: string }>(request.body);

    if (!body.orderId) {
      throw new ValidationError({ message: `orderId is required` });
    }

    const cart = await cartApi.replicateCart(body.orderId);
    const order = await cartApi.order(cart, body?.orderId);

    return {
      statusCode: 200,
      body: JSON.stringify(order),
      sessionData: {
        ...request.sessionData,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const splitLineItem: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);

    const body = parseRequestBody<{
      lineItemId?: string;
      shippingAddresses: { address: Address; count: number }[];
    }>(request.body);

    let cart = await CartFetcher.fetchCart(request, actionContext.frontasticContext);
    cart = await cartApi.splitLineItem(cart, body.lineItemId, body.shippingAddresses);

    return {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...request.sessionData,
        cartId: cart.cartId,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const reassignCart: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    let cart = await CartFetcher.fetchCart(request, actionContext.frontasticContext);
    const cartId = cart.cartId;

    const body = parseRequestBody<{
      accountId?: string;
      email?: string;
    }>(request.body);

    const cartApi = getCartApi(request, actionContext.frontasticContext);

    cart = await cartApi.setCustomerId(cart, body.accountId);
    cart = await cartApi.setEmail(cart, body.email);

    return {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...request.sessionData,
        cartId,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const removeLineItem: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);

    const body = parseRequestBody<{
      lineItem?: { id?: string; count: number };
    }>(request.body);

    const lineItem: LineItem = {
      lineItemId: body.lineItem?.id,
    };

    let cart = await CartFetcher.fetchCart(request, actionContext.frontasticContext);

    cart = await cartApi.removeLineItem(cart, lineItem);

    const cartId = cart.cartId;

    return {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...request.sessionData,
        cartId,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const updateCart: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cart = await updateCartFromRequest(request, actionContext);
    const cartId = cart.cartId;

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...request.sessionData,
        cartId,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const checkout: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const locale = getLocale(request);
    const cartApi = getCartApi(request, actionContext.frontasticContext);

    const body = parseRequestBody<{
      purchaseOrderNumber?: string;
    }>(request.body);

    const cart = await updateCartFromRequest(request, actionContext);
    const order = await cartApi.order(cart, body.purchaseOrderNumber);
    const emailApi = EmailApiFactory.getDefaultApi(actionContext.frontasticContext, locale);

    emailApi.sendOrderConfirmationEmail({ ...order, email: order.email || cart.email });

    // Unset the cartId
    const cartId: string = undefined;

    return {
      statusCode: 200,
      body: JSON.stringify(order),
      sessionData: {
        ...request.sessionData,
        cartId,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const queryOrders: ActionHook = async (request, actionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);

    const orderQuery = OrderQueryFactory.queryFromParams(request);

    const queryResult = await cartApi.queryOrders(orderQuery);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(queryResult),
      sessionData: request.sessionData,
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const getShippingMethods: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);
    const onlyMatching = request.query.onlyMatching === 'true';

    const shippingMethods = await cartApi.getShippingMethods(onlyMatching);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(shippingMethods),
      sessionData: {
        ...request.sessionData,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const getAvailableShippingMethods: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);
    const cart = await CartFetcher.fetchCart(request, actionContext.frontasticContext);

    const availableShippingMethods = await cartApi.getAvailableShippingMethods(cart);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(availableShippingMethods),
      sessionData: {
        ...request.sessionData,
        cartId: cart.cartId,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const setShippingMethod: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);
    let cart = await CartFetcher.fetchCart(request, actionContext.frontasticContext);

    const body = parseRequestBody<{ shippingMethod?: { id?: string } }>(request.body);

    const shippingMethod: ShippingMethod = {
      shippingMethodId: body.shippingMethod?.id,
    };

    cart = await cartApi.setShippingMethod(cart, shippingMethod);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...request.sessionData,
        cartId: cart.cartId,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const addPaymentByInvoice: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);
    let cart = await CartFetcher.fetchCart(request, actionContext.frontasticContext);

    const body = parseRequestBody<{ payment?: Payment }>(request.body);

    const payment: Payment = {
      ...body.payment,
      paymentProvider: 'frontastic',
      paymentMethod: 'invoice',
      paymentStatus: PaymentStatuses.PENDING,
    };

    if (payment.amountPlanned === undefined) {
      payment.amountPlanned = {};
    }

    payment.amountPlanned.centAmount = payment.amountPlanned.centAmount ?? cart.sum.centAmount ?? undefined;
    payment.amountPlanned.currencyCode = payment.amountPlanned.currencyCode ?? cart.sum.currencyCode ?? undefined;

    cart = await cartApi.addPayment(cart, payment);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...request.sessionData,
        cartId: cart.cartId,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const updatePayment: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);
    const cart = await CartFetcher.fetchCart(request, actionContext.frontasticContext);

    const body = parseRequestBody<{ payment?: Payment }>(request.body);

    const payment = await cartApi.updatePayment(cart, body.payment);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(payment),
      sessionData: {
        ...request.sessionData,
        cartId: cart.cartId,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const redeemDiscount: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);
    let cart = await CartFetcher.fetchCart(request, actionContext.frontasticContext);

    const body = parseRequestBody<{ code?: string }>(request.body);

    cart = await cartApi.redeemDiscountCode(cart, body.code);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...request.sessionData,
        cartId: cart.cartId,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const removeDiscount: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);
    let cart = await CartFetcher.fetchCart(request, actionContext.frontasticContext);

    const body = parseRequestBody<{ discountCodeId?: string }>(request.body);

    const discount: DiscountCode = {
      discountCodeId: body?.discountCodeId,
    };

    cart = await cartApi.removeDiscountCode(cart, discount);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...request.sessionData,
        cartId: cart.cartId,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const getCheckoutSessionToken: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    let checkoutSessionToken: Token;
    const cartApi = getCartApi(request, actionContext.frontasticContext);

    // We are getting the cartId from the session data so carts that are not active can be used
    const cartId = request.sessionData?.cartId;

    if (cartId !== undefined) {
      checkoutSessionToken = await cartApi.getCheckoutSessionToken(cartId);
    }

    const response: Response = {
      statusCode: 200,
      body: checkoutSessionToken ? JSON.stringify(checkoutSessionToken) : '',
      sessionData: {
        ...cartApi.getSessionData(),
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const getRecurrencePolicies: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);

    const recurrencePolicyQuery: RecurrencePolicyQuery = {
      limit: request.query?.limit ?? undefined,
      cursor: request.query?.cursor ?? undefined,
      recurrencePolicyIds: queryParamsToIds('recurrencePolicyIds', request.query),
      keys: queryParamsToIds('keys', request.query),
    };
    const recurrencePolicies = await cartApi.getRecurrencePolicies(recurrencePolicyQuery);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(recurrencePolicies),
      sessionData: {
        ...request.sessionData,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const queryRecurringOrders: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);

    const recurringOrderQuery = RecurringOrderFactory.queryFromParams(request);

    const recurringOrders = await cartApi.queryRecurringOrders(recurringOrderQuery);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(recurringOrders),
      sessionData: {
        ...request.sessionData,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const pauseRecurringOrder: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);

    const body = parseRequestBody<{
      recurringOrderId: string;
    }>(request.body);

    const response = await cartApi.pauseRecurringOrder(body.recurringOrderId);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const resumeRecurringOrder: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);

    const body = parseRequestBody<{
      recurringOrderId: string;
    }>(request.body);

    const response = await cartApi.resumeRecurringOrder(body.recurringOrderId);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const cancelRecurringOrder: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);

    const body = parseRequestBody<{
      recurringOrderId: string;
    }>(request.body);

    const response = await cartApi.cancelRecurringOrder(body.recurringOrderId);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const skipRecurringOrder: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);

    const body = parseRequestBody<{
      recurringOrderId: string;
    }>(request.body);

    const response = await cartApi.skipRecurringOrder(body.recurringOrderId);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const updateRecurringOrderLineItems: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);

    const body = parseRequestBody<{
      recurringOrderId: string;
      lineItems: LineItem[];
    }>(request.body);

    if (!body.recurringOrderId) {
      throw new ValidationError({ message: `recurringOrderId is required` });
    }

    if (!body.lineItems || body.lineItems.length === 0) {
      throw new ValidationError({ message: `lineItems array is required and must not be empty` });
    }

    const response = await cartApi.updateRecurringOrderLineItems(body.recurringOrderId, body.lineItems);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const updateRecurringOrderSchedule: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext.frontasticContext);

    const body = parseRequestBody<{
      recurringOrderId: string;
      recurrencePolicyId: string;
    }>(request.body);

    const response = await cartApi.updateRecurringOrderSchedule(body.recurringOrderId, body.recurrencePolicyId);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};
