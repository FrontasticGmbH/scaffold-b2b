import { BaseApi } from './BaseApi';
import { BaseWishlistMapper } from '../mappers/BaseWishlistMapper';
import { Wishlist } from '@Types/wishlist/Wishlist';
import { ExternalError } from '@Commerce-commercetools/utils/Errors';
import { Account } from '@Types/account/Account';

const expandVariants = ['lineItems[*].variant'];

interface AddToWishlistRequest {
  sku: string;
  count: number;
}

export class BaseWishlistApi extends BaseApi {
  getById = async (wishlistId: string) => {
    const locale = await this.getCommercetoolsLocal();
    return await this.requestBuilder()
      .shoppingLists()
      .withId({ ID: wishlistId })
      .get({
        queryArgs: {
          expand: expandVariants,
        },
      })
      .execute()
      .then((response) => {
        return BaseWishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
      })
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  };

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
          BaseWishlistMapper.commercetoolsShoppingListToWishlist(shoppingList, locale),
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
        return BaseWishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
      })
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  };

  create = async (wishlist: Wishlist) => {
    const locale = await this.getCommercetoolsLocal();
    const body = BaseWishlistMapper.wishlistToCommercetoolsShoppingListDraft(wishlist, locale);

    return await this.requestBuilder()
      .shoppingLists()
      .post({
        body: body,
        queryArgs: {
          expand: expandVariants,
        },
      })
      .execute()
      .then((response) => {
        return BaseWishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
      })
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  };

  addToWishlist = async (wishlist: Wishlist, request: AddToWishlistRequest) => {
    const locale = await this.getCommercetoolsLocal();

    return await this.requestBuilder()
      .shoppingLists()
      .withId({ ID: wishlist.wishlistId })
      .post({
        body: {
          version: +wishlist.wishlistVersion,
          actions: [
            {
              action: 'addLineItem',
              sku: request.sku,
              quantity: request.count,
            },
          ],
        },
        queryArgs: {
          expand: expandVariants,
        },
      })
      .execute()
      .then((response) => {
        return BaseWishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
      })
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  };

  removeLineItem = async (wishlist: Wishlist, lineItemId: string) => {
    const locale = await this.getCommercetoolsLocal();

    return await this.requestBuilder()
      .shoppingLists()
      .withId({ ID: wishlist.wishlistId })
      .post({
        body: {
          version: +wishlist.wishlistVersion,
          actions: [
            {
              action: 'removeLineItem',
              lineItemId,
            },
          ],
        },
        queryArgs: {
          expand: expandVariants,
        },
      })
      .execute()
      .then((response) => {
        return BaseWishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
      })
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  };

  clearWishlist = async (wishlist: Wishlist) => {
    const locale = await this.getCommercetoolsLocal();

    return await this.requestBuilder()
      .shoppingLists()
      .withId({ ID: wishlist.wishlistId })
      .delete({
        queryArgs: {
          version: +wishlist.wishlistVersion,
        },
      })
      .execute()
      .then((response) => {
        return BaseWishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
      })
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  };

  updateLineItemCount = async (wishlist: Wishlist, lineItemId: string, count: number) => {
    const locale = await this.getCommercetoolsLocal();

    return await this.requestBuilder()
      .shoppingLists()
      .withId({ ID: wishlist.wishlistId })
      .post({
        body: {
          version: +wishlist.wishlistVersion,
          actions: [
            {
              action: 'changeLineItemQuantity',
              lineItemId,
              quantity: count,
            },
          ],
        },
        queryArgs: {
          expand: expandVariants,
        },
      })
      .execute()
      .then((response) => {
        return BaseWishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
      })
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  };
}
