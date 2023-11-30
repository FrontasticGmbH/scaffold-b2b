import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { Cart } from '@Types/cart/Cart';
import { LineItem } from '@Types/cart/LineItem';
import { Discount } from '@Types/cart/Discount';
import { Address } from '@Types/account/Address';
import { CartFetcher } from '../utils/CartFetcher';
import { ShippingMethod } from '@Types/cart/ShippingMethod';
import { Payment, PaymentStatuses } from '@Types/cart/Payment';
import { getCurrency, getLocale } from '../utils/Request';
import { CartRedeemDiscountCodeError } from '../errors/CartRedeemDiscountCodeError';
import { CartApi } from '../apis/CartApi';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

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

export const getCart: ActionHook = async (request, actionContext) => {
  try {
    const cart = await CartFetcher.fetchCart(request, actionContext);
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
    const errorResponse = error as Error;
    return {
      statusCode: 400,
      message: errorResponse.message,
    };
  }
};

export const updateLineItem: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  const body: {
    lineItem?: { id?: string; count: number };
  } = JSON.parse(request.body);

  const lineItem: LineItem = {
    lineItemId: body.lineItem?.id,
    count: +body.lineItem?.count || 1,
  };

  let cart = await CartFetcher.fetchCart(request, actionContext);
  cart = await cartApi.updateLineItem(cart, lineItem);

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

export const removeLineItem: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  const body: {
    lineItem?: { id?: string };
  } = JSON.parse(request.body);

  const lineItem: LineItem = {
    lineItemId: body.lineItem?.id,
  };

  let cart = await CartFetcher.fetchCart(request, actionContext);
  cart = await cartApi.removeLineItem(cart, lineItem);

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
  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  const cart = await updateCartFromRequest(request, actionContext);

  const order = await cartApi.order(cart);

  // Unset the cartId
  const cartId: string = undefined;

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(order),
    sessionData: {
      ...request.sessionData,
      cartId,
    },
  };

  return response;
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
