import { Wishlist } from '@Types/wishlist/Wishlist';
import { ShoppingList, ShoppingListLineItem, StoreKeyReference } from '@commercetools/platform-sdk';
import { ShoppingListDraft } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/shopping-list';
import { Store } from '@Types/store/Store';
import { LineItem } from '@Types/wishlist';
import { Locale } from '@Commerce-commercetools/interfaces/Locale';
import { ProductMapper } from '@Commerce-commercetools/mappers/ProductMapper';
import { ProductRouter } from '@Commerce-commercetools/utils/ProductRouter';

export class WishlistMapper {
  static commercetoolsShoppingListToWishlist = (
    commercetoolsShoppingList: ShoppingList,
    locale: Locale,
    supplyChannelId?: string,
  ): Wishlist => {
    return {
      wishlistId: commercetoolsShoppingList.id,
      wishlistVersion: commercetoolsShoppingList.version.toString(),
      accountId: commercetoolsShoppingList.customer?.id ?? undefined,
      name: commercetoolsShoppingList.name[locale.language],
      description: commercetoolsShoppingList.description?.[locale.language],
      lineItems: (commercetoolsShoppingList.lineItems || []).map((lineItem) =>
        this.commercetoolsLineItemToLineItem(lineItem, locale, supplyChannelId),
      ),
      store: this.commercetoolsStoreRefToStore(commercetoolsShoppingList.store),
    };
  };

  static commercetoolsLineItemToLineItem(
    commercetoolsLineItem: ShoppingListLineItem,
    locale: Locale,
    supplyChannelId?: string,
  ): LineItem {
    const lineItem: LineItem = {
      lineItemId: commercetoolsLineItem.id,
      productId: commercetoolsLineItem.productId,
      name: commercetoolsLineItem.name[locale.language],
      type: 'variant',
      addedAt: new Date(commercetoolsLineItem.addedAt),
      count: commercetoolsLineItem.quantity,
      variant: ProductMapper.commercetoolsProductVariantToVariant(
        commercetoolsLineItem.variant,
        locale,
        supplyChannelId,
      ),
    };

    lineItem._url = ProductRouter.generateUrlFor(lineItem);
    return lineItem;
  }

  static wishlistToCommercetoolsShoppingListDraft = (wishlist: Wishlist, locale: Locale): ShoppingListDraft => {
    return {
      customer: !wishlist.accountId ? undefined : { typeId: 'customer', id: wishlist.accountId },
      name: { [locale.language]: wishlist.name || '' },
      description: { [locale.language]: wishlist.description || '' },
      store: !wishlist?.store?.key ? undefined : { typeId: 'store', key: wishlist.store.key },
    };
  };

  private static commercetoolsStoreRefToStore = (commercetoolsStoreRef: StoreKeyReference): Store => {
    return {
      key: commercetoolsStoreRef?.key,
    };
  };
}
