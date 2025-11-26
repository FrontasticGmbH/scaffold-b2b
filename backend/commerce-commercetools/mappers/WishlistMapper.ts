import { Wishlist } from '@Types/wishlist/Wishlist';
import { ShoppingList, ShoppingListLineItem, StoreKeyReference } from '@commercetools/platform-sdk';
import { Store } from '@Types/store/Store';
import { LineItem } from '@Types/wishlist';
import AccountMapper from './AccountMapper';
import { Locale } from '@Commerce-commercetools/interfaces/Locale';
import ProductMapper from '@Commerce-commercetools/mappers/ProductMapper';
import ProductRouter from '@Commerce-commercetools/utils/routers/ProductRouter';
import LocalizedValue from '@Commerce-commercetools/utils/LocalizedValue';

export class WishlistMapper {
  static commercetoolsShoppingListToWishlist = (
    commercetoolsShoppingList: ShoppingList,
    locale: Locale,
    defaultLocale: Locale,
    supplyChannelId?: string,
  ): Wishlist => {
    return {
      wishlistId: commercetoolsShoppingList.id,
      wishlistVersion: commercetoolsShoppingList.version.toString(),
      key: commercetoolsShoppingList?.key,
      account: AccountMapper.commercetoolsCustomerToAccount(commercetoolsShoppingList.customer?.obj) ?? undefined,
      name: LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsShoppingList.name),
      description: LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsShoppingList.description),
      lineItems: (commercetoolsShoppingList.lineItems || []).map((lineItem) =>
        this.commercetoolsLineItemToLineItem(lineItem, locale, defaultLocale, supplyChannelId),
      ),
      slug: LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsShoppingList.slug),
      store: this.commercetoolsStoreRefToStore(commercetoolsShoppingList.store),
      businessUnitKey: commercetoolsShoppingList.businessUnit?.key,
      createdAt: commercetoolsShoppingList.createdAt,
    };
  };

  static commercetoolsLineItemToLineItem(
    commercetoolsLineItem: ShoppingListLineItem,
    locale: Locale,
    defaultLocale: Locale,
    supplyChannelId?: string,
  ): LineItem {
    const lineItem: LineItem = {
      lineItemId: commercetoolsLineItem.id,
      productId: commercetoolsLineItem.productId,
      productSlug: LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsLineItem.productSlug),
      name: LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsLineItem.name) || '',
      type: 'variant',
      addedAt: new Date(commercetoolsLineItem.addedAt),
      count: commercetoolsLineItem.quantity,
      variant: ProductMapper.commercetoolsProductVariantToVariant(
        commercetoolsLineItem.variant,
        locale,
        defaultLocale,
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
