import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { LineItem } from '@Types/cart/LineItem';
import { OrderState, ReturnLineItem } from '@Types/cart/Order';
import { getCurrency, getLocale } from '../utils/Request';
import { Cart } from '@Types/cart/Cart';
import { Address } from '@Types/account/Address';
import { CartFetcher } from '../utils/CartFetcher';
import { CartApi } from '../apis/CartApi';
import { EmailApiFactory } from '../utils/EmailApiFactory';
import handleError from '@Commerce-commercetools/utils/handleError';
import { fetchAccountFromSession } from '@Commerce-commercetools/utils/fetchAccountFromSession';
import { AccountAuthenticationError } from '@Commerce-commercetools/errors/AccountAuthenticationError';
import { Discount, ShippingMethod } from '@Types/cart';
import { Payment, PaymentStatuses } from '@Types/cart/Payment';
import { CartRedeemDiscountCodeError } from '@Commerce-commercetools/errors/CartRedeemDiscountCodeError';
import { OrderQueryFactory } from '@Commerce-commercetools/utils/OrderQueryFactory';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

export const getCart: ActionHook = async (request, actionContext) => {
  try {
    const cart = await CartFetcher.fetchCart(request, actionContext);

    return {
      statusCode: 200,
      body: cart ? JSON.stringify(cart) : '',
      sessionData: {
        ...request.sessionData,
        ...(cart ? { cartId: cart.cartId } : {}),
      },
    };
  } catch (error) {
    const errorResponse = error as Error;
    return {
      statusCode: 400,
      message: errorResponse.message,
    };
  }
};

async function updateCartFromRequest(request: Request, actionContext: ActionContext): Promise<Cart> {
  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));
  let cart = await CartFetcher.fetchCart(request, actionContext);

  if (request?.body === undefined || request?.body === '') {
    return cart;
  }

  const body: {
    account?: { email?: string };
    shipping?: Address;
    billing?: Address;
  } = JSON.parse(request.body);

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

export const addToCart: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  const body: {
    lineItems?: LineItem[];
    businessUnitKey?: string;
  } = JSON.parse(request.body);

  const account = fetchAccountFromSession(request);

  try {
    let cart = await CartFetcher.fetchCart(request, actionContext);

    cart = await cartApi.addToCart(cart, body.lineItems, account, body.businessUnitKey);

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
  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  const body: {
    lineItem?: { id?: string; count: number };
    businessUnitKey?: string;
  } = JSON.parse(request.body);

  const lineItem: LineItem = {
    lineItemId: body.lineItem?.id,
    count: +body.lineItem?.count || 1,
  };

  const account = fetchAccountFromSession(request);

  try {
    let cart = await CartFetcher.fetchCart(request, actionContext);
    cart = await cartApi.updateLineItem(cart, lineItem, account, body.businessUnitKey);

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
  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  try {
    const body: {
      orderId: string;
      returnLineItems: ReturnLineItem[];
      businessUnitKey?: string;
    } = JSON.parse(request.body);

    const account = fetchAccountFromSession(request);

    const res = await cartApi.returnItems(body.orderId, body.returnLineItems, account, body.businessUnitKey);
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
  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  try {
    const body: {
      orderId: string;
      businessUnitKey?: string;
    } = JSON.parse(request.body);

    const account = fetchAccountFromSession(request);
    const res = await cartApi.updateOrderState(body.orderId, OrderState.Cancelled, account, body.businessUnitKey);

    return {
      statusCode: 200,
      body: JSON.stringify(res),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const replicateCart: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));
  const body: {
    orderId: string;
    businessUnitKey?: string;
  } = JSON.parse(request.body);

  if (!body.orderId) {
    return {
      statusCode: 500,
      sessionData: request.sessionData,
      error: 'orderId is required',
    };
  }
  try {
    const account = fetchAccountFromSession(request);

    const cart = await cartApi.replicateCart(body.orderId, account, body.businessUnitKey);
    const order = await cartApi.order(cart, account, body?.businessUnitKey);
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
  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  const body: {
    lineItemId?: string;
    businessUnitKey?: string;
    shippingAddresses: { address: Address; count: number }[];
  } = JSON.parse(request.body);

  const account = fetchAccountFromSession(request);

  try {
    let cart = await CartFetcher.fetchCart(request, actionContext);
    cart = await cartApi.splitLineItem(cart, body.lineItemId, body.shippingAddresses, account, body.businessUnitKey);

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
  let cart = await CartFetcher.fetchCart(request, actionContext);
  const cartId = cart.cartId;
  const body: {
    accountId?: string;
    email?: string;
    businessUnitKey?: string;
  } = JSON.parse(request.body);

  const account = fetchAccountFromSession(request);

  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));
  try {
    cart = await cartApi.setCustomerId(cart, body.accountId, account, body?.businessUnitKey);
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
  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  const body: {
    lineItem?: { id?: string };
    businessUnitKey?: string;
  } = JSON.parse(request.body);

  const lineItem: LineItem = {
    lineItemId: body.lineItem?.id,
  };

  let cart = await CartFetcher.fetchCart(request, actionContext);

  const account = fetchAccountFromSession(request);
  try {
    cart = await cartApi.removeLineItem(cart, lineItem, account, body?.businessUnitKey);

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
};

export const checkout: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const locale = getLocale(request);
  const cartApi = new CartApi(actionContext.frontasticContext, locale, getCurrency(request));

  const body: {
    purchaseOrderNumber?: string;
    businessUnitKey?: string;
  } = JSON.parse(request.body);

  const account = fetchAccountFromSession(request);

  try {
    const cart = await updateCartFromRequest(request, actionContext);
    const order = await cartApi.order(cart, account, body.businessUnitKey, body.purchaseOrderNumber);
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
  const locale = getLocale(request);
  const cartApi = new CartApi(actionContext.frontasticContext, locale, getCurrency(request));

  const account = fetchAccountFromSession(request);
  if (account === undefined) {
    throw new AccountAuthenticationError({ message: 'Not logged in.' });
  }

  const orderQuery = OrderQueryFactory.queryFromParams(request, account);

  try {
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
  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));
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
};

export const getAvailableShippingMethods: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));
  const cart = await CartFetcher.fetchCart(request, actionContext);

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
};

export const setShippingMethod: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));
  let cart = await CartFetcher.fetchCart(request, actionContext);

  const body: {
    shippingMethod?: { id?: string };
  } = JSON.parse(request.body);

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
};

export const addPaymentByInvoice: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));
  let cart = await CartFetcher.fetchCart(request, actionContext);

  const body: {
    payment?: Payment;
  } = JSON.parse(request.body);

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
};

export const updatePayment: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));
  const cart = await CartFetcher.fetchCart(request, actionContext);

  const body: {
    payment?: Payment;
  } = JSON.parse(request.body);

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
};

export const redeemDiscount: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));
  let cart = await CartFetcher.fetchCart(request, actionContext);

  const body: {
    code?: string;
  } = JSON.parse(request.body);

  let response: Response;

  try {
    cart = await cartApi.redeemDiscountCode(cart, body.code);

    response = {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...request.sessionData,
        cartId: cart.cartId,
      },
    };
  } catch (error) {
    if (error instanceof CartRedeemDiscountCodeError) {
      response = {
        statusCode: error.status,
        body: JSON.stringify(error.message),
        sessionData: {
          ...request.sessionData,
          cartId: cart.cartId,
        },
      };

      return response;
    }

    throw error;
  }

  return response;
};

export const removeDiscount: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));
  let cart = await CartFetcher.fetchCart(request, actionContext);

  const body: {
    discountId?: string;
  } = JSON.parse(request.body);

  const discount: Discount = {
    discountId: body?.discountId,
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
};
