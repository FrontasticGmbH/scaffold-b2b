import { Wishlist } from '@shared/types/wishlist/Wishlist';
import { LineItem } from '@shared/types/wishlist/LineItem';
import { PurchaseList, PurchaseListItem } from '@/types/entity/purchase-list';
import { Currency } from '@/types/currency';
import { mapStore } from './map-store';

export const mapPurchaseItem = ({ lineItemId, name, count, variant, _url }: LineItem): PurchaseListItem => {
  return {
    id: lineItemId,
    sku: variant?.sku ?? '',
    url: _url ?? '#',
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
    store: store ? mapStore(store) : undefined,
    description: description ?? '',
    items: (lineItems ?? []).map(mapPurchaseItem),
  };
};
