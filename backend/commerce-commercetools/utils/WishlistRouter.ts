import { Context, Request } from '@frontastic/extension-types';
import { Wishlist } from '@Types/wishlist/Wishlist';
import { WishlistQuery } from '@Types/wishlist';
import { PaginatedResult } from '@Types/result';
import { getPath } from './Request';
import { fetchAccountFromSession } from '@Commerce-commercetools/utils/fetchAccountFromSession';
import getWishlistApi from '@Commerce-commercetools/utils/getWishlistApi';

export default class WishlistRouter {
  static identifyFrom(request: Request) {
    if (getPath(request)?.match(/\/(wishlist|shopping-list)\/([^\/]+)/)) {
      return true;
    }

    return false;
  }

  static identifyPreviewFrom(request: Request) {
    if (getPath(request)?.match(/\/preview\/.+\/(wishlist|shopping-list)\/([^\/]+)/)) {
      return true;
    }

    return false;
  }

  static loadFor = async (request: Request, frontasticContext: Context): Promise<PaginatedResult<Wishlist>> => {
    const wishlistApi = getWishlistApi(request, frontasticContext);

    const urlMatches = getPath(request)?.match(/\/(wishlist|shopping-list)\/([^\/]+)/);

    const account = fetchAccountFromSession(request);

    if (urlMatches) {
      const wishlistQuery: WishlistQuery = {
        name: request.query?.name ?? undefined,
        accountId: account.accountId,
        limit: request.query?.limit ?? undefined,
        cursor: request.query?.cursor ?? undefined,
        wishlistIds: [urlMatches[2]],
        query: request.query?.query ?? undefined,
      };
      return wishlistApi.queryWishlists(wishlistQuery);
    }

    return null;
  };

  static loadPreviewFor = async (request: Request, frontasticContext: Context): Promise<PaginatedResult<Wishlist>> => {
    const wishlistApi = getWishlistApi(request, frontasticContext);

    const urlMatches = getPath(request)?.match(/\/preview\/.+\/(wishlist|shopping-list)\/([^\/]+)/);

    const account = fetchAccountFromSession(request);

    if (urlMatches) {
      const wishlistQuery: WishlistQuery = {
        name: request.query?.name ?? undefined,
        accountId: account.accountId,
        limit: request.query?.limit ?? undefined,
        cursor: request.query?.cursor ?? undefined,
        wishlistIds: [urlMatches[2]],
        query: request.query?.query ?? undefined,
      };
      return wishlistApi.queryWishlists(wishlistQuery);
    }

    return null;
  };
}
