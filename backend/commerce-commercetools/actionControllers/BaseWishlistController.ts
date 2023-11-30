import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { getCurrency, getLocale } from '../utils/Request';
import { BaseWishlistApi as WishlistApi } from '../apis/BaseWishlistApi';
import handleError from '@Commerce-commercetools/utils/handleError';
import { Wishlist } from '@Types/wishlist/Wishlist';
import { Account } from '@Types/account/Account';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

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

export const createWishlist: ActionHook = async (request, actionContext) => {
  const wishlistApi = getWishlistApi(request, actionContext);

  const body: {
    name?: string;
  } = JSON.parse(request.body);

  const account = fetchAccountFromSessionEnsureLoggedIn(request);

  try {
    const wishlist = await wishlistApi.create({ accountId: account.accountId, name: body.name ?? 'Wishlist' });

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

export const addToWishlist: ActionHook = async (request, actionContext) => {
  const wishlistApi = getWishlistApi(request, actionContext);
  const wishlist = await fetchWishlist(request, wishlistApi);

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
        wishlistId: updatedWishlist.wishlistId,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const removeLineItem: ActionHook = async (request, actionContext) => {
  const wishlistApi = getWishlistApi(request, actionContext);
  const wishlist = await fetchWishlist(request, wishlistApi);

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
        wishlistId: updatedWishlist.wishlistId,
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

export const updateLineItemCount: ActionHook = async (request, actionContext) => {
  const wishlistApi = getWishlistApi(request, actionContext);
  const wishlist = await fetchWishlist(request, wishlistApi);

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
        wishlistId: updatedWishlist.wishlistId,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};
