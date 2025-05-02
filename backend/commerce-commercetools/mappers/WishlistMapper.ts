import { Wishlist } from '@Types/wishlist/Wishlist';
import { ShoppingList, ShoppingListLineItem, StoreKeyReference } from '@commercetools/platform-sdk';
import { Store } from '@Types/store/Store';
import { LineItem } from '@Types/wishlist';
import { Locale } from '@Commerce-commercetools/interfaces/Locale';
import ProductMapper from '@Commerce-commercetools/mappers/ProductMapper';
import ProductRouter from '@Commerce-commercetools/utils/routers/ProductRouter';
import LocalizedValue from '@Commerce-commercetools/utils/LocalizedValue';

export class WishlistMapper {
  static commercetoolsShoppingListToWishlist = (
    commercetoolsShoppingList: ShoppingList,
    locale: Locale,
    defaultLocale: string,
    supplyChannelId?: string,
  ): Wishlist => {
    return {
      wishlistId: commercetoolsShoppingList.id,
      wishlistVersion: commercetoolsShoppingList.version.toString(),
      key: commercetoolsShoppingList?.key,
      accountId: commercetoolsShoppingList.customer?.id ?? undefined,
      name: commercetoolsShoppingList.name[locale.language],
      description: commercetoolsShoppingList.description?.[locale.language],
      lineItems: (commercetoolsShoppingList.lineItems || []).map((lineItem) =>
        this.commercetoolsLineItemToLineItem(lineItem, locale, supplyChannelId),
      ),
      slug: LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsShoppingList.slug),
      store: this.commercetoolsStoreRefToStore(commercetoolsShoppingList.store),
      businessUnitKey: commercetoolsShoppingList.businessUnit?.key,
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
      productSlug: commercetoolsLineItem.productSlug?.[locale.language],
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

  private static commercetoolsStoreRefToStore = (commercetoolsStoreRef: StoreKeyReference): Store => {
    return {
      key: commercetoolsStoreRef?.key,
    };
  };
}
