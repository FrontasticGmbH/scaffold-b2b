import { fetchAccountFromSessionEnsureLoggedIn } from '@Commerce-commercetools/utils/fetchAccountFromSession';

export * from './BaseWishlistController';
import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { WishlistApi } from '../apis/WishlistApi';
import { getCurrency, getLocale } from '../utils/Request';
import handleError from '@Commerce-commercetools/utils/handleError';
import { WishlistFetcher } from '@Commerce-commercetools/utils/WishlistFetcher';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

function getWishlistApi(request: Request, actionContext: ActionContext) {
  return new WishlistApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));
}

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
      throw new Error('No storeKey');
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
  const wishlistApi = getWishlistApi(request, actionContext);
  const wishlist = await WishlistFetcher.fetchWishlist(request, actionContext);

  const body: {
    variant?: { sku?: string };
    count?: number;
  } = JSON.parse(request.body);

  try {
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

export const removeLineItem: ActionHook = async (request, actionContext) => {
  const wishlistApi = getWishlistApi(request, actionContext);
  const wishlist = await WishlistFetcher.fetchWishlist(request, actionContext);

  const body: {
    lineItem?: { id?: string };
  } = JSON.parse(request.body);

  try {
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
  const wishlistApi = getWishlistApi(request, actionContext);
  const wishlist = await WishlistFetcher.fetchWishlist(request, actionContext);

  const body: {
    lineItem?: { id?: string };
    count?: number;
  } = JSON.parse(request.body);

  try {
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
