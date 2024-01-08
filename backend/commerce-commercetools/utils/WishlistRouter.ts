import { Context, Request } from '@frontastic/extension-types';
import { getCurrency, getLocale, getPath } from './Request';
import { Wishlist } from '@Types/wishlist/Wishlist';
import { WishlistApi } from '../apis/WishlistApi';
import { fetchAccountFromSession } from '@Commerce-commercetools/utils/fetchAccountFromSession';
import { WishlistQuery } from '@Types/wishlist';
import { PaginatedResult } from '@Types/result';

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
    const wishlistApi = new WishlistApi(frontasticContext, getLocale(request), getCurrency(request));

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
    const wishlistApi = new WishlistApi(frontasticContext, getLocale(request), getCurrency(request));

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
