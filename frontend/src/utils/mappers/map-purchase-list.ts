import { Wishlist } from '@shared/types/wishlist/Wishlist';
import { LineItem } from '@shared/types/wishlist/LineItem';
import { PurchaseList, PurchaseListItem } from '@/types/entity/purchase-list';
import { Currency } from '@/types/currency';

export const mapPurchaseItem = ({ lineItemId, name, count, variant }: LineItem): PurchaseListItem => {
  return {
    id: lineItemId,
    name: name ?? '',
    quantity: count ?? 1,
    image: variant?.images?.[0],
    price: (variant?.price?.centAmount ?? 0) / Math.pow(10, variant?.price?.fractionDigits ?? 2),
    currency: (variant?.price?.currencyCode ?? 'AUD') as Currency,
    inStock: !!variant?.isOnStock,
  };
};

export const mapPurchaseList = ({ wishlistId, name, description, lineItems, store }: Wishlist): PurchaseList => {
  return {
    id: wishlistId as string,
    name: name ?? '',
    store: store?.name ?? store?.key ?? '',
    description: description ?? '',
    items: (lineItems ?? []).map(mapPurchaseItem),
  };
};
