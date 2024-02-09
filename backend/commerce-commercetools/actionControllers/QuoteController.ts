import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { QuoteRequest } from '@Types/quote/QuoteRequest';
import { QuoteQuery } from '@Types/query/QuoteQuery';
import { SortAttributes, SortOrder } from '@Types/query/ProductQuery';
import { CartFetcher } from '@Commerce-commercetools/utils/CartFetcher';
import queryParamsToIds from '@Commerce-commercetools/utils/queryParamsToIds';
import queryParamsToStates from '@Commerce-commercetools/utils/queryParamsToState';
import handleError from '@Commerce-commercetools/utils/handleError';
import getCartApi from '@Commerce-commercetools/utils/getCartApi';
import getQuoteApi from '@Commerce-commercetools/utils/getQuoteApi';
import parseRequestBody from '@Commerce-commercetools/utils/parseRequestBody';
import { ValidationError } from '@Commerce-commercetools/errors/ValidationError';
import parseQueryParams from '@Commerce-commercetools/utils/parseRequestParams';
import { fetchAccountFromSession } from '@Commerce-commercetools/utils/fetchAccountFromSession';
import { getBusinessUnitKey, getStoreKey } from '@Commerce-commercetools/utils/Request';
import { CartState } from '@Types/cart/Cart';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

export interface QuoteRequestBody {
  comment: string;
}

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

export const createQuoteRequest: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const quoteApi = getQuoteApi(request, actionContext.frontasticContext);
    const cartApi = getCartApi(request, actionContext.frontasticContext);

    const quoteBody = parseRequestBody<QuoteRequestBody>(request.body);
    let quoteRequest: QuoteRequest = {
      buyerComment: quoteBody.comment,
    };

    const cart = await CartFetcher.fetchCart(request, actionContext);

    quoteRequest = await quoteApi.createQuoteRequest(quoteRequest, cart);

    await cartApi.deleteCart(cart);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(quoteRequest),
      sessionData: {
        ...request.sessionData,
        cartId: undefined,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const query: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const quoteApi = getQuoteApi(request, actionContext.frontasticContext);

    const quoteQuery: QuoteQuery = {
      limit: request.query?.limit ?? undefined,
      cursor: request.query?.cursor ?? undefined,
      quoteIds: queryParamsToIds('quoteIds', request.query),
      quoteStates: queryParamsToStates('quoteStates', request.query),
      sortAttributes: queryParamsToSortAttributes(request.query),
      query: request.query?.query ?? undefined,
    };

    const queryResult = await quoteApi.query(quoteQuery);

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

export const queryQuoteRequests: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const quoteApi = getQuoteApi(request, actionContext.frontasticContext);

    const quoteQuery: QuoteQuery = {
      limit: request.query?.limit ?? undefined,
      cursor: request.query?.cursor ?? undefined,
      quoteIds: queryParamsToIds('quoteIds', request.query),
      quoteStates: queryParamsToStates('quoteStates', request.query),
      sortAttributes: queryParamsToSortAttributes(request.query),
      query: request.query?.query ?? undefined,
    };

    const queryResult = await quoteApi.queryQuoteRequests(quoteQuery);

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

export const acceptQuote: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const quoteApi = getQuoteApi(request, actionContext.frontasticContext);

    const { id: quoteId } = parseQueryParams<{ id: string }>(request.query);

    if (!quoteId) {
      throw new ValidationError({ message: 'Quote id is missing.' });
    }

    const quote = await quoteApi.acceptQuote(quoteId);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(quote),
      sessionData: {
        ...request.sessionData,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const getQuotationCart: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const quoteApi = getQuoteApi(request, actionContext.frontasticContext);
    const cartApi = getCartApi(request, actionContext.frontasticContext);
    const account = fetchAccountFromSession(request);
    const businessUnitKey = getBusinessUnitKey(request);
    const storeKey = getStoreKey(request);

    const { id: quoteId } = parseQueryParams<{ id: string }>(request.query);

    if (!quoteId) {
      throw new ValidationError({ message: 'Quote id is missing.' });
    }

    const quote = await quoteApi.getQuote(quoteId);

    let cart = await cartApi.getById(quote.quoteRequest.quotationCart.cartId);

    if (!cartApi.assertCartForBusinessUnitAndStore(cart, businessUnitKey, storeKey)) {
      throw new ValidationError({ message: 'Cart does not belong to the current business unit or store.' });
    }

    if (cart.cartState === CartState.Ordered) {
      throw new ValidationError({ message: 'Cart has already been ordered.' });
    }

    if (cart.email !== account.email) {
      cart = await cartApi.setEmail(cart, account.email);
    }

    if (cart.accountId !== account.accountId) {
      cart = await cartApi.setCustomerId(cart, account.accountId);
    }

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

export const declineQuote: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const quoteApi = getQuoteApi(request, actionContext.frontasticContext);

    const { id: quoteId } = parseQueryParams<{ id: string }>(request.query);

    if (!quoteId) {
      throw new ValidationError({ message: 'Quote id is missing.' });
    }

    const quote = await quoteApi.declineQuote(quoteId);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(quote),
      sessionData: {
        ...request.sessionData,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const renegotiateQuote: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const quoteApi = getQuoteApi(request, actionContext.frontasticContext);

    const { id: quoteId } = parseQueryParams<{ id: string }>(request.query);
    const { comment: buyerComment } = parseRequestBody<{ comment: string }>(request.body);

    const quote = await quoteApi.renegotiateQuote(quoteId, buyerComment);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(quote),
      sessionData: {
        ...request.sessionData,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const cancelQuoteRequest: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const quoteApi = getQuoteApi(request, actionContext.frontasticContext);

    const { id: quoteRequestId } = parseQueryParams<{ id: string }>(request.query);

    if (!quoteRequestId) {
      throw new ValidationError({ message: 'QuoteRequest  id is missing.' });
    }

    const quoteRequest = await quoteApi.cancelQuoteRequest(quoteRequestId);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(quoteRequest),
      sessionData: {
        ...request.sessionData,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};
