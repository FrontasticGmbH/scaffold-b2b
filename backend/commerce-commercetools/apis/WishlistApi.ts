import { Wishlist } from '@Types/wishlist/Wishlist';
import {
  ShoppingListDraft as shoppingListDraft,
  ShoppingListUpdateAction,
} from '@commercetools/platform-sdk/dist/declarations/src/generated/models/shopping-list';
import { PaginatedResult } from '@Types/result';
import { WishlistQuery } from '@Types/wishlist';
import { Context } from '@frontastic/extension-types';
import { getOffsetFromCursor } from '@Commerce-commercetools/utils/Pagination';
import ProductMapper from '@Commerce-commercetools/mappers/ProductMapper';
import BaseApi from '@Commerce-commercetools/apis/BaseApi';
import { WishlistMapper } from '@Commerce-commercetools/mappers/WishlistMapper';
import { ExternalError } from '@Commerce-commercetools/errors/ExternalError';

const expandVariants = ['lineItems[*].variant', 'store', 'customer'];

interface AddToWishlistRequest {
  sku: string;
  count: number;
}

export default class WishlistApi extends BaseApi {
  protected accountId: string;
  protected distributionChannelId: string;
  protected supplyChannelId: string;
  protected businessUnitKey: string;

  constructor(
    context: Context,
    locale: string | null,
    currency: string | null,
    accountId?: string,
    distributionChannelId?: string,
    supplyChannelId?: string,
    businessUnitKey?: string,
  ) {
    super(context, locale, currency);
    this.accountId = accountId;
    this.distributionChannelId = distributionChannelId;
    this.supplyChannelId = supplyChannelId;
    this.businessUnitKey = businessUnitKey;
  }

  async getForAccount(accountId: string) {
    const locale = await this.getCommercetoolsLocal();

    return await this.associateEndpoints(accountId, this.businessUnitKey)
      .shoppingLists()
      .get({
        queryArgs: {
          expand: expandVariants,
        },
      })
      .execute()
      .then((response) => {
        return response.body.results.map((shoppingList) =>
          WishlistMapper.commercetoolsShoppingListToWishlist(
            shoppingList,
            locale,
            this.defaultLocale,
            this.supplyChannelId,
          ),
        );
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async getByIdForAccount(wishlistId: string, accountId: string) {
    const locale = await this.getCommercetoolsLocal();
    return await this.associateEndpoints(accountId, this.businessUnitKey)
      .shoppingLists()
      .withId({ ID: wishlistId })
      .get({
        queryArgs: {
          expand: expandVariants,
        },
      })
      .execute()
      .then((response) => {
        return WishlistMapper.commercetoolsShoppingListToWishlist(
          response.body,
          locale,
          this.defaultLocale,
          this.supplyChannelId,
        );
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async create(accountId: string, storeKey: string, name?: string, description?: string) {
    const locale = await this.getCommercetoolsLocal();

    const body: shoppingListDraft = {
      customer: { typeId: 'customer', id: accountId },
      name: { [locale.language]: name || 'Wishlist' },
      description: { [locale.language]: description || '' },
      store: !storeKey ? undefined : { typeId: 'store', key: storeKey },
      businessUnit: { key: this.businessUnitKey, typeId: 'business-unit' },
    };

    return await this.associateEndpoints(this.accountId, this.businessUnitKey)
      .shoppingLists()
      .post({
        body,
        queryArgs: {
          expand: expandVariants,
        },
      })
      .execute()
      .then((response) => {
        return WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale, this.defaultLocale);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async delete(wishlist: Wishlist) {
    await this.associateEndpoints(this.accountId, this.businessUnitKey)
      .shoppingLists()
      .withId({ ID: wishlist.wishlistId })
      .delete({
        queryArgs: {
          version: +wishlist.wishlistVersion,
        },
      })
      .execute()
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async addToWishlist(wishlist: Wishlist, request: AddToWishlistRequest) {
    const locale = await this.getCommercetoolsLocal();

    return await this.associateEndpoints(this.accountId, this.businessUnitKey)
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
        return WishlistMapper.commercetoolsShoppingListToWishlist(
          response.body,
          locale,
          this.defaultLocale,
          this.supplyChannelId,
        );
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async removeLineItem(wishlist: Wishlist, lineItemId: string) {
    const locale = await this.getCommercetoolsLocal();

    return await this.associateEndpoints(this.accountId, this.businessUnitKey)
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
        return WishlistMapper.commercetoolsShoppingListToWishlist(
          response.body,
          locale,
          this.defaultLocale,
          this.supplyChannelId,
        );
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async updateLineItemCount(wishlist: Wishlist, lineItemId: string, count: number) {
    const locale = await this.getCommercetoolsLocal();

    return await this.associateEndpoints(this.accountId, this.businessUnitKey)
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
        return WishlistMapper.commercetoolsShoppingListToWishlist(
          response.body,
          locale,
          this.defaultLocale,
          this.supplyChannelId,
        );
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async setNameAndDescription(wishlist: Wishlist, name?: string, description?: string) {
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

    return await this.associateEndpoints(this.accountId, this.businessUnitKey)
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
        return WishlistMapper.commercetoolsShoppingListToWishlist(response.body, locale, this.defaultLocale);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async queryWishlists(wishlistQuery: WishlistQuery): Promise<PaginatedResult<Wishlist>> {
    const locale = await this.getCommercetoolsLocal();
    const limit = +wishlistQuery.limit || undefined;

    const whereClause = [];

    if (wishlistQuery.storeKey !== undefined) {
      whereClause.push(`store(key="${wishlistQuery.storeKey}")`);
    }

    if (wishlistQuery.wishlistIds !== undefined && wishlistQuery.wishlistIds.length !== 0) {
      whereClause.push(`id in ("${wishlistQuery.wishlistIds.join('","')}")`);
    }
    if (wishlistQuery.businessUnitKey) {
      whereClause.push(`businessUnit(key="${wishlistQuery.businessUnitKey}")`);
    }

    const searchQuery = wishlistQuery.query && wishlistQuery.query;

    const request = {
      queryArgs: {
        where: whereClause,
        expand: expandVariants,
        limit: limit,
        offset: getOffsetFromCursor(wishlistQuery.cursor),
        [`text.${locale.language}`]: searchQuery,
      },
    };

    return await this.associateEndpoints(this.accountId, this.businessUnitKey)
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
          return WishlistMapper.commercetoolsShoppingListToWishlist(
            commercetoolsQuote,
            locale,
            this.defaultLocale,
            this.supplyChannelId,
          );
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
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }
}
