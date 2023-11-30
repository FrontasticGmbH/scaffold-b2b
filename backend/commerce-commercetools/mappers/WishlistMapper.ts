import { Wishlist } from '@Types/wishlist/Wishlist';
import { ShoppingList, StoreKeyReference } from '@commercetools/platform-sdk';
import { ShoppingListDraft } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/shopping-list';
import { Store } from '@Types/store/Store';
import { Locale } from '@Commerce-commercetools/interfaces/Locale';
import { BaseWishlistMapper } from './BaseWishlistMapper';

export class WishlistMapper extends BaseWishlistMapper {
  static commercetoolsShoppingListToWishlist = (commercetoolsShoppingList: ShoppingList, locale: Locale): Wishlist => {
    return {
      wishlistId: commercetoolsShoppingList.id,
      wishlistVersion: commercetoolsShoppingList.version.toString(),
      accountId: commercetoolsShoppingList.customer?.id ?? undefined,
      name: commercetoolsShoppingList.name[locale.language],
      description: commercetoolsShoppingList.description?.[locale.language],
      lineItems: (commercetoolsShoppingList.lineItems || []).map((lineItem) =>
        this.commercetoolsLineItemToLineItem(lineItem, locale),
      ),
      store: this.commercetoolsStoreRefToStore(commercetoolsShoppingList.store),
    };
  };

  private static commercetoolsStoreRefToStore = (commercetoolsStoreRef: StoreKeyReference): Store => {
    return {
      key: commercetoolsStoreRef?.key,
    };
  };

  static wishlistToCommercetoolsShoppingListDraft = (wishlist: Wishlist, locale: Locale): ShoppingListDraft => {
    return {
      customer: !wishlist.accountId ? undefined : { typeId: 'customer', id: wishlist.accountId },
      name: { [locale.language]: wishlist.name || '' },
      description: { [locale.language]: wishlist.description || '' },
      store: !wishlist?.store?.key ? undefined : { typeId: 'store', key: wishlist.store.key },
    };
  };
}

// Override the BaseMapper with new Mapper functions
Object.getOwnPropertyNames(WishlistMapper).forEach((key) => {
  if (typeof WishlistMapper[key] === 'function') {
    BaseWishlistMapper[key] = WishlistMapper[key];
  }
});
