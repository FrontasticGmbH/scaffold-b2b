import { ActionContext, Request } from '@frontastic/extension-types';
import { Wishlist } from '@Types/wishlist/Wishlist';
import { WishlistQuery } from '@Types/wishlist';
import { fetchAccountFromSessionEnsureLoggedIn } from './fetchAccountFromSession';
import getWishlistApi from '@Commerce-commercetools/utils/apiConstructors/getWishlistApi';

export class WishlistFetcher {
  static async fetchWishlist(request: Request, actionContext: ActionContext): Promise<Wishlist> {
    const wishlistApi = getWishlistApi(request, actionContext.frontasticContext);

    const account = fetchAccountFromSessionEnsureLoggedIn(request);

    const wishlistId = request.query?.id ?? request.sessionData?.wishlistId ?? undefined;

    if (wishlistId !== undefined) {
      const wishlistQuery: WishlistQuery = {
        accountId: account.accountId,
        wishlistIds: [wishlistId],
      };

      const wishlists = await wishlistApi.queryWishlists(wishlistQuery);

      if (wishlists.total > 0) {
        return wishlists.items[0];
      }
    }

    return await wishlistApi.create({ accountId: account.accountId, name: 'Wishlist' });
  }
}
