import { Wishlist } from '@Types/wishlist/Wishlist';
import { ExternalError } from '@Commerce-commercetools/utils/Errors';
import { Account } from '@Types/account/Account';
import { ShoppingListUpdateAction } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/shopping-list';
import { PaginatedResult } from '@Types/result';
import { getOffsetFromCursor } from '@Commerce-commercetools/utils/Pagination';
import { ProductMapper } from '@Commerce-commercetools/mappers/ProductMapper';
import { WishlistQuery } from '@Types/wishlist';
import { BaseApi } from '@Commerce-commercetools/apis/BaseApi';
import { WishlistMapper } from '@Commerce-commercetools/mappers/WishlistMapper';

const expandVariants = ['lineItems[*].variant', 'store'];

interface AddToWishlistRequest {
  sku: string;
  count: number;
}

export class WishlistApi extends BaseApi {
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
        return WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
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
        return WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
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
        return WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
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
        return WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale);
      })
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

  async queryWishlists(wishlistQuery: WishlistQuery): Promise<PaginatedResult<Wishlist>> {
    const locale = await this.getCommercetoolsLocal();
    const limit = +wishlistQuery.limit || undefined;

    const whereClause = [`customer(id="${wishlistQuery.accountId}")`];

    if (wishlistQuery.storeKey !== undefined) {
      whereClause.push(`store(key="${wishlistQuery.storeKey}")`);
    }

    if (wishlistQuery.wishlistIds !== undefined && wishlistQuery.wishlistIds.length !== 0) {
      whereClause.push(`id in ("${wishlistQuery.wishlistIds.join('","')}")`);
    }

    const searchQuery = wishlistQuery.query && wishlistQuery.query;

    return this.requestBuilder()
      .shoppingLists()
      .get({
        queryArgs: {
          where: whereClause,
          expand: expandVariants,
          limit: limit,
          offset: getOffsetFromCursor(wishlistQuery.cursor),
          [`text.${locale.language}`]: searchQuery,
        },
      })
      .execute()
      .then((response) => {
        const wishlists = response.body.results.map((commercetoolsQuote) => {
          return WishlistMapper.commercetoolsShoppingListToWishlist(commercetoolsQuote, locale);
        });

        return {
          total: response.body.total,
          items: wishlists,
          count: response.body.count,
          previousCursor: ProductMapper.calculatePreviousCursor(response.body.offset, response.body.count),
          nextCursor: ProductMapper.calculateNextCursor(response.body.offset, response.body.count, response.body.total),
          query: wishlistQuery,
        };
      })
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  }
}
