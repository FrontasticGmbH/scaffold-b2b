import { ActionContext, Request } from '@frontastic/extension-types';
import { Wishlist } from '@Types/wishlist/Wishlist';
import { getCurrency, getLocale } from './Request';
import { WishlistApi } from '../apis/WishlistApi';
import { fetchAccountFromSessionEnsureLoggedIn } from './fetchAccountFromSession';
import { WishlistQuery } from '@Types/wishlist';

export class WishlistFetcher {
  static async fetchWishlist(request: Request, actionContext: ActionContext): Promise<Wishlist> {
    const wishlistApi = new WishlistApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

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
