import { Wishlist } from '@Types/wishlist/Wishlist';
import { BaseWishlistApi } from './BaseWishlistApi';
import { WishlistMapper } from '../mappers/WishlistMapper';
import { ExternalError } from '@Commerce-commercetools/utils/Errors';
import { Account } from '@Types/account/Account';
import { ShoppingListUpdateAction } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/shopping-list';

const expandVariants = ['lineItems[*].variant', 'store'];

export class WishlistApi extends BaseWishlistApi {
  getForAccount = async (account: Account) => {
    const locale = await this.getCommercetoolsLocal();

    return await this.requestBuilder()
      .shoppingLists()
      .get({
        queryArgs: {
          where: `customer(id="${account.accountId}")`,
          expand: expandVariants,
        },
      })
      .execute()
      .then((response) => {
        return response.body.results.map((shoppingList) =>
          WishlistMapper.commercetoolsShoppingListToWishlist(shoppingList, locale),
        );
      })
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  };

  getByStoreKeyForAccount = async (storeKey: string, account: Account) => {
    const locale = await this.getCommercetoolsLocal();
    return await this.requestBuilder()
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .shoppingLists()
      .get({
        queryArgs: {
          where: [`customer(id="${account.accountId}")`],
          expand: expandVariants,
        },
      })
      .execute()
      .then((response) => {
        return response.body.results.map((shoppingList) =>
          WishlistMapper.commercetoolsShoppingListToWishlist(shoppingList, locale),
        );
      })
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  };

  getByIdForAccount = async (wishlistId: string, account: Account) => {
    const locale = await this.getCommercetoolsLocal();

    return await this.requestBuilder()
      .shoppingLists()
      .withId({ ID: wishlistId })
      .get({
        queryArgs: {
          where: `customer(id="${account.accountId}")`,
          expand: expandVariants,
        },
      })
      .execute()
      .then((response) => {
        return WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
      })
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  };

  create = async (wishlist: Wishlist) => {
    const locale = await this.getCommercetoolsLocal();
    const body = WishlistMapper.wishlistToCommercetoolsShoppingListDraft(wishlist, locale);
    return await this.requestBuilder()
      .inStoreKeyWithStoreKeyValue({ storeKey: wishlist?.store?.key })
      .shoppingLists()
      .post({
        body: body,
        queryArgs: {
          expand: expandVariants,
        },
      })
      .execute()
      .then((response) => {
        return WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
      })
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  };

  delete = async (wishlist: Wishlist, storeKey: string) => {
    await this.requestBuilder()
      .inStoreKeyWithStoreKeyValue({ storeKey })
      .shoppingLists()
      .withId({ ID: wishlist.wishlistId })
      .delete({
        queryArgs: {
          version: +wishlist.wishlistVersion,
        },
      })
      .execute()
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  };

  setNameAndDescription = async (wishlist: Wishlist, name?: string, description?: string) => {
    const locale = await this.getCommercetoolsLocal();

    const updateActions: ShoppingListUpdateAction[] = [];

    if (name) {
      updateActions.push({
        action: 'changeName',
        name: {
          [locale.language]: name,
        },
      });
    }

    if (description) {
      updateActions.push({
        action: 'setDescription',
        description: {
          [locale.language]: description,
        },
      });
    }

    return await this.requestBuilder()
      .shoppingLists()
      .withId({ ID: wishlist.wishlistId })
      .post({
        body: {
          version: +wishlist.wishlistVersion,
          actions: updateActions,
        },
        queryArgs: {
          expand: expandVariants,
        },
      })
      .execute()
      .then((response) => {
        return WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
      })
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  };
}
