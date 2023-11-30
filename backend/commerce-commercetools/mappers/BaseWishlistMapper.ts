import { Wishlist } from '@Types/wishlist/Wishlist';
import { ShoppingList, ShoppingListLineItem } from '@commercetools/platform-sdk';
import { ShoppingListDraft } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/shopping-list';
import { Locale } from '@Commerce-commercetools/interfaces/Locale';
import { LineItem } from '@Types/wishlist/LineItem';
import { ProductRouter } from '../utils/ProductRouter';
import { ProductMapper } from './ProductMapper';

export class BaseWishlistMapper {
  static commercetoolsShoppingListToWishlist(commercetoolsShoppingList: ShoppingList, locale: Locale): Wishlist {
    return {
      wishlistId: commercetoolsShoppingList.id,
      wishlistVersion: commercetoolsShoppingList.version.toString(),
      accountId: commercetoolsShoppingList.customer?.id ?? undefined,
      name: commercetoolsShoppingList.name[locale.language],
      description: commercetoolsShoppingList.description[locale.language],
      lineItems: (commercetoolsShoppingList.lineItems || []).map((lineItem) =>
        this.commercetoolsLineItemToLineItem(lineItem, locale),
      ),
    };
  }

  static commercetoolsLineItemToLineItem(commercetoolsLineItem: ShoppingListLineItem, locale: Locale): LineItem {
    const lineItem: LineItem = {
      lineItemId: commercetoolsLineItem.id,
      productId: commercetoolsLineItem.productId,
      name: commercetoolsLineItem.name[locale.language],
      type: 'variant',
      addedAt: new Date(commercetoolsLineItem.addedAt),
      count: commercetoolsLineItem.quantity,
      variant: ProductMapper.commercetoolsProductVariantToVariant(commercetoolsLineItem.variant, locale),
    };

    lineItem._url = ProductRouter.generateUrlFor(lineItem);
    return lineItem;
  }

  static wishlistToCommercetoolsShoppingListDraft(wishlist: Wishlist, locale: Locale): ShoppingListDraft {
    return {
      customer: wishlist.accountId === undefined ? undefined : { typeId: 'customer', id: wishlist.accountId },
      name: { [locale.language]: wishlist.name || '' },
      description: { [locale.language]: wishlist.description || '' },
    };
  }
}
