import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { Wishlist, WishlistQuery } from '@Types/wishlist';
import handleError from '@Commerce-commercetools/utils/handleError';
import { WishlistFetcher } from '@Commerce-commercetools/utils/WishlistFetcher';
import parseRequestBody from '@Commerce-commercetools/utils/requestHandlers/parseRequestBody';
import queryParamsToIds from '@Commerce-commercetools/utils/requestHandlers/queryParamsToIds';
import { ValidationError } from '@Commerce-commercetools/errors/ValidationError';
import getWishlistApi from '@Commerce-commercetools/utils/apiConstructors/getWishlistApi';
import WishlistApi from '@Commerce-commercetools/apis/WishlistApi';
import { getBusinessUnitKey, getStoreKey } from '@Commerce-commercetools/utils/requestHandlers/Request';
import { AccountFetcher } from '@Commerce-commercetools/utils/AccountFetcher';
type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

async function fetchWishlist(request: Request, wishlistApi: WishlistApi): Promise<Wishlist> {
  const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

  const wishlistId = request.sessionData?.wishlistId ?? undefined;

  if (wishlistId !== undefined) {
    return await wishlistApi.getByIdForAccount(wishlistId, accountId);
  }

  const accountWishlists = await wishlistApi.getForAccount(accountId);
  if (accountWishlists.length > 0) {
    return accountWishlists[0];
  }

  const storeKey = getStoreKey(request);

  return await wishlistApi.create(accountId, storeKey);
}

export const getWishlist: ActionHook = async (request, actionContext) => {
  try {
    const wishlistApi = getWishlistApi(request, actionContext.frontasticContext);

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

export const queryWishlists: ActionHook = async (request, actionContext) => {
  try {
    const wishlistApi = getWishlistApi(request, actionContext.frontasticContext);

    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);
    const storeKey = getStoreKey(request);
    const businessUnitKey = getBusinessUnitKey(request);

    const wishlistQuery: WishlistQuery = {
      name: request.query?.name ?? undefined,
      accountId,
      limit: request.query?.limit ?? undefined,
      cursor: request.query?.cursor ?? undefined,
      storeKey,
      businessUnitKey,
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
  try {
    const wishlistApi = getWishlistApi(request, actionContext.frontasticContext);

    const body: {
      name?: string;
      description?: string;
    } = JSON.parse(request.body);

    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const storeKey = request.query?.['storeKey'];

    if (!storeKey) {
      throw new ValidationError({ message: 'No storeKey' });
    }

    const wishlist = await wishlistApi.create(accountId, storeKey, body.name, body.description);

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
    const wishlistApi = getWishlistApi(request, actionContext.frontasticContext);
    const wishlist = await WishlistFetcher.fetchWishlist(request, actionContext);

    await wishlistApi.delete(wishlist);

    return {
      statusCode: 200,
      body: JSON.stringify(null),
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

    const wishlistApi = getWishlistApi(request, actionContext.frontasticContext);

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
    const wishlistApi = getWishlistApi(request, actionContext.frontasticContext);
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
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const wishlistApi = getWishlistApi(request, actionContext.frontasticContext);

    const wishlistBody = parseRequestBody<{
      wishlistIds: string[];
      variant?: { sku: string };
      count?: number;
    }>(request.body);

    const wishlistQuery: WishlistQuery = {
      accountId,
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
    const wishlistApi = getWishlistApi(request, actionContext.frontasticContext);
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

export const removeLineItems: ActionHook = async (request, actionContext) => {
  try {
    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const wishlistApi = getWishlistApi(request, actionContext.frontasticContext);

    const requestBody = parseRequestBody<{
      wishlists: {
        lineItemId: string;
        wishlistId: string;
      }[];
    }>(request.body);

    const wishlistQuery: WishlistQuery = {
      accountId,
      wishlistIds: requestBody.wishlists.map((item) => item.wishlistId),
    };

    const wishlists = await wishlistApi.queryWishlists(wishlistQuery);

    if (wishlists.total == 0) {
      return {
        statusCode: 400,
        message: 'We could not complete your request',
        sessionData: request?.sessionData,
      };
    }

    const removeLineItemsPromises = wishlists.items.flatMap((wishlist) => {
      return requestBody.wishlists
        .filter((body) => body.wishlistId === wishlist.wishlistId)
        .map(async (body) => {
          return await wishlistApi.removeLineItem(wishlist, body.lineItemId);
        });
    });

    const response = await Promise.all(removeLineItemsPromises);

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

export const updateLineItemCount: ActionHook = async (request, actionContext) => {
  try {
    const wishlistApi = getWishlistApi(request, actionContext.frontasticContext);
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
