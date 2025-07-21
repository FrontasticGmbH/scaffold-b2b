import { ActionContext, Request } from '@frontastic/extension-types';
import { Wishlist } from '@Types/wishlist/Wishlist';
import { WishlistQuery } from '@Types/wishlist';
import getWishlistApi from '@Commerce-commercetools/utils/apiFactories/getWishlistApi';
import { getStoreKey } from '@Commerce-commercetools/utils/requestHandlers/Request';
import { AccountFetcher } from '@Commerce-commercetools/utils/AccountFetcher';

export class WishlistFetcher {
  static async fetchWishlist(request: Request, actionContext: ActionContext): Promise<Wishlist> {
    const wishlistApi = getWishlistApi(request, actionContext.frontasticContext);

    const accountId = AccountFetcher.fetchAccountIdFromSessionEnsureLoggedIn(request);

    const wishlistId = request.query?.id ?? request.sessionData?.wishlistId ?? undefined;

    const storeKey = getStoreKey(request);

    if (wishlistId !== undefined) {
      const wishlistQuery: WishlistQuery = {
        accountId,
        wishlistIds: [wishlistId],
      };

      const wishlists = await wishlistApi.queryWishlists(wishlistQuery);

      if (wishlists.total > 0) {
        return wishlists.items[0];
      }
    }

    return await wishlistApi.create(accountId, storeKey);
  }
}
