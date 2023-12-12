import { ActionContext, Request } from '@frontastic/extension-types';
import { Wishlist } from '@Types/wishlist/Wishlist';
import { getCurrency, getLocale } from './Request';
import { BaseWishlistApi as WishlistApi } from '../apis/BaseWishlistApi';
import { fetchAccountFromSessionEnsureLoggedIn } from './fetchAccountFromSession';

export class WishlistFetcher {
  static async fetchWishlist(request: Request, actionContext: ActionContext): Promise<Wishlist> {
    const wishlistApi = new WishlistApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

    const account = fetchAccountFromSessionEnsureLoggedIn(request);

    const wishlistId = request.query?.id ?? request.sessionData?.wishlistId ?? undefined;

    if (wishlistId !== undefined) {
      return await wishlistApi.getByIdForAccount(wishlistId, account);
    }

    const accountWishlists = await wishlistApi.getForAccount(account);
    if (accountWishlists.length > 0) {
      return accountWishlists[0];
    }

    return await wishlistApi.create({ accountId: account.accountId, name: 'Wishlist' });
  }
}
