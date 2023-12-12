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
import { OrderQuery } from '@Types/cart';
import { SortAttributes, SortOrder } from '@Types/query/ProductQuery';
import queryParamsToStates from '@Commerce-commercetools/utils/queryParamsToState';
import queryParamsToIds from '@Commerce-commercetools/utils/queryParamsToIds';

export * from './BaseCartController';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

function queryParamsToSortAttributes(queryParams: any) {
  const sortAttributes: SortAttributes = {};

  if (queryParams.sortAttributes) {
    let sortAttribute;

    for (sortAttribute of Object.values(queryParams.sortAttributes)) {
      const key = Object.keys(sortAttribute)[0];
      sortAttributes[key] = sortAttribute[key] ? sortAttribute[key] : SortOrder.ASCENDING;
    }
  }

  return sortAttributes;
}

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

  let cart = await CartFetcher.fetchCart(request, actionContext);
  const account = fetchAccountFromSession(request);

  cart = await cartApi.splitLineItem(cart, body.lineItemId, body.shippingAddresses, account, body.businessUnitKey);

  return {
    statusCode: 200,
    body: JSON.stringify(cart),
    sessionData: {
      ...request.sessionData,
      cartId: cart.cartId,
    },
  };
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
};

export const checkout: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const locale = getLocale(request);
  const cartApi = new CartApi(actionContext.frontasticContext, locale, getCurrency(request));

  const cart = await updateCartFromRequest(request, actionContext);

  const body: {
    purchaseOrderNumber?: string;
    businessUnitKey?: string;
  } = JSON.parse(request.body);

  const account = fetchAccountFromSession(request);

  try {
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

  try {
    const orderQuery: OrderQuery = {
      accountId: account.accountId,
      limit: request.query?.limit ?? undefined,
      cursor: request.query?.cursor ?? undefined,
      orderIds: queryParamsToIds('orderIds', request.query),
      orderState: queryParamsToStates('orderStates', request.query),
      sortAttributes: queryParamsToSortAttributes(request.query),
      businessUnitKey: request.query?.businessUnitKey ?? undefined,
      query: request.query?.query ?? undefined,
    };

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
