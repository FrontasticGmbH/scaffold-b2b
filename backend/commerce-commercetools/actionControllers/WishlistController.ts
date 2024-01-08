import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { WishlistApi } from '../apis/WishlistApi';
import { getCurrency, getLocale } from '../utils/Request';
import handleError from '@Commerce-commercetools/utils/handleError';
import { WishlistFetcher } from '@Commerce-commercetools/utils/WishlistFetcher';
import parseRequestBody from '@Commerce-commercetools/utils/parseRequestBody';
import { AccountAuthenticationError } from '@Commerce-commercetools/errors/AccountAuthenticationError';
import queryParamsToIds from '@Commerce-commercetools/utils/queryParamsToIds';
import { Wishlist, WishlistQuery } from '@Types/wishlist';
import { Account } from '@Types/account';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;
type WishlistBody = {
  wishlistIds: string[];
  variant?: { sku?: string };
  count?: number;
};

function getWishlistApi(request: Request, actionContext: ActionContext) {
  return new WishlistApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));
}

function fetchAccountFromSession(request: Request): Account | undefined {
  return request.sessionData?.account;
}

function fetchAccountFromSessionEnsureLoggedIn(request: Request): Account {
  const account = fetchAccountFromSession(request);
  if (!account) {
    throw new Error('Not logged in.');
  }
  return account;
}

async function fetchWishlist(request: Request, wishlistApi: WishlistApi): Promise<Wishlist> {
  const account = fetchAccountFromSessionEnsureLoggedIn(request);

  const wishlistId = request.sessionData?.wishlistId ?? undefined;

  if (wishlistId !== undefined) {
    return await wishlistApi.getByIdForAccount(wishlistId, account);
  }

  const accountWishlists = await wishlistApi.getForAccount(account);
  if (accountWishlists.length > 0) {
    return accountWishlists[0];
  }

  return await wishlistApi.create({ accountId: account.accountId, name: 'Wishlist' });
}

export const getWishlist: ActionHook = async (request, actionContext) => {
  const wishlistApi = getWishlistApi(request, actionContext);
  try {
    const wishlist = await fetchWishlist(request, wishlistApi);
    return {
      statusCode: 200,
      body: JSON.stringify(wishlist),
      sessionData: {
        ...request.sessionData,
        wishlistId: wishlist.wishlistId,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

/**
 * @deprecated  Use `queryWishlists` instead.
 */
export const getWishlists: ActionHook = async (request, actionContext) => {
  try {
    const account = fetchAccountFromSessionEnsureLoggedIn(request);

    const storeKey = request.query?.['storeKey'] ?? undefined;

    const wishlistApi = getWishlistApi(request, actionContext);
    const wishlists = storeKey
      ? await wishlistApi.getByStoreKeyForAccount(storeKey, account)
      : await wishlistApi.getForAccount(account);

    return {
      statusCode: 200,
      body: JSON.stringify(wishlists),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const queryWishlists: ActionHook = async (request, actionContext) => {
  const wishlistApi = getWishlistApi(request, actionContext);

  const account = fetchAccountFromSession(request);
  if (account === undefined) {
    throw new AccountAuthenticationError({ message: 'Not logged in.' });
  }

  try {
    const wishlistQuery: WishlistQuery = {
      name: request.query?.name ?? undefined,
      accountId: account.accountId,
      limit: request.query?.limit ?? undefined,
      cursor: request.query?.cursor ?? undefined,
      storeKey: request.query?.storeKey ?? undefined,
      wishlistIds: queryParamsToIds('wishlistIds', request.query),
      query: request.query?.query ?? undefined,
    };

    const queryResult = await wishlistApi.queryWishlists(wishlistQuery);
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

export const createWishlist: ActionHook = async (request, actionContext) => {
  const wishlistApi = getWishlistApi(request, actionContext);

  const body: {
    name?: string;
    description?: string;
  } = JSON.parse(request.body);

  const account = fetchAccountFromSessionEnsureLoggedIn(request);

  const storeKey = request.query?.['storeKey'];

  if (!storeKey) {
    throw new Error('No storeKey');
  }

  try {
    const wishlist = await wishlistApi.create({
      accountId: account.accountId,
      name: body.name ?? 'Wishlist',
      description: body.description ?? undefined,
      store: { key: storeKey },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(wishlist),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const deleteWishlist: ActionHook = async (request, actionContext) => {
  try {
    const wishlistApi = getWishlistApi(request, actionContext);
    const wishlist = await WishlistFetcher.fetchWishlist(request, actionContext);

    const storeKey = request.query?.['storeKey'];

    if (!storeKey) {
      const error = new Error('No storeKey');
      return handleError(error, request);
    }

    await wishlistApi.delete(wishlist, storeKey);

    return {
      statusCode: 200,
      body: '',
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const updateWishlist: ActionHook = async (request, actionContext) => {
  try {
    const body: {
      name?: string;
      description?: string;
    } = JSON.parse(request.body);

    const wishlistApi = getWishlistApi(request, actionContext);

    let wishlist = await WishlistFetcher.fetchWishlist(request, actionContext);

    if (body?.name !== undefined) {
      wishlist = await wishlistApi.setNameAndDescription(wishlist, body.name, body.description);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(wishlist),
      sessionData: request.sessionData,
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const addToWishlist: ActionHook = async (request, actionContext) => {
  try {
    const wishlistApi = getWishlistApi(request, actionContext);
    const wishlist = await WishlistFetcher.fetchWishlist(request, actionContext);

    const body: {
      variant?: { sku?: string };
      count?: number;
    } = JSON.parse(request.body);

    const updatedWishlist = await wishlistApi.addToWishlist(wishlist, {
      sku: body?.variant?.sku || undefined,
      count: body.count || 1,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(updatedWishlist),
      sessionData: {
        ...request.sessionData,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const addToWishlists: ActionHook = async (request, actionContext) => {
  const account = fetchAccountFromSessionEnsureLoggedIn(request);

  const wishlistApi = getWishlistApi(request, actionContext);

  const wishlistBody = parseRequestBody<WishlistBody>(request.body);

  try {
    const wishlistQuery: WishlistQuery = {
      accountId: account.accountId,
      wishlistIds: wishlistBody.wishlistIds,
    };

    const wishlists = await wishlistApi.queryWishlists(wishlistQuery);

    if (wishlists.total == 0) {
      return {
        statusCode: 400,
        message: 'We could not complete your request',
        sessionData: request?.sessionData,
      };
    }

    const wishlistPromises = wishlists.items.map(
      async (wishlist) =>
        await wishlistApi.addToWishlist(wishlist, {
          sku: wishlistBody.variant?.sku || undefined,
          count: wishlistBody.count || 1,
        }),
    );

    const response = await Promise.all(wishlistPromises);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
      sessionData: {
        ...request.sessionData,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const removeLineItem: ActionHook = async (request, actionContext) => {
  try {
    const wishlistApi = getWishlistApi(request, actionContext);
    const wishlist = await WishlistFetcher.fetchWishlist(request, actionContext);

    const body: {
      lineItem?: { id?: string };
    } = JSON.parse(request.body);

    const updatedWishlist = await wishlistApi.removeLineItem(wishlist, body.lineItem?.id ?? undefined);

    return {
      statusCode: 200,
      body: JSON.stringify(updatedWishlist),
      sessionData: {
        ...request.sessionData,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const updateLineItemCount: ActionHook = async (request, actionContext) => {
  try {
    const wishlistApi = getWishlistApi(request, actionContext);
    const wishlist = await WishlistFetcher.fetchWishlist(request, actionContext);

    const body: {
      lineItem?: { id?: string };
      count?: number;
    } = JSON.parse(request.body);

    const updatedWishlist = await wishlistApi.updateLineItemCount(
      wishlist,
      body.lineItem?.id ?? undefined,
      body.count || 1,
    );

    return {
      statusCode: 200,
      body: JSON.stringify(updatedWishlist),
      sessionData: {
        ...request.sessionData,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const clearWishlist: ActionHook = async (request, actionContext) => {
  try {
    const wishlistApi = getWishlistApi(request, actionContext);
    const wishlist = await fetchWishlist(request, wishlistApi);
    await wishlistApi.clearWishlist(wishlist);
    return {
      statusCode: 200,
      body: JSON.stringify({}),
      sessionData: {
        ...request.sessionData,
        wishlistId: undefined,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};
