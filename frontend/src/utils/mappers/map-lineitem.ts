import { Product } from '@/types/entity/product';
import { LineItem } from '@shared/types/cart/LineItem';

export const mapLineItem = (lineItem: LineItem): Product => {
  const variant = lineItem.variant;

  const price =
    (lineItem.price?.centAmount ?? variant?.price?.centAmount ?? 0) -
    (lineItem.taxRate?.includedInPrice ? (lineItem.taxed?.taxAmount?.centAmount ?? 0) : 0);
  const discountedPrice = lineItem.discountedPrice?.value?.centAmount ?? variant?.discountedPrice?.value?.centAmount;
  const fractionDigits = lineItem.price?.fractionDigits ?? variant?.price?.fractionDigits ?? 2;
  const currency = lineItem.price?.currencyCode ?? variant?.price?.currencyCode ?? 'USD';

  return {
    id: lineItem.lineItemId,
    url: lineItem._url,
    sku: variant?.sku,
    name: lineItem.name,
    description: variant?.attributes?.['Product-Specifications'],
    images: variant?.images,
    quantity: lineItem.count,
    price: price / Math.pow(10, fractionDigits),
    ...(discountedPrice ? { discountedPrice: discountedPrice / Math.pow(10, fractionDigits) } : {}),
    currency,
    inStock: variant?.isOnStock,
    maxQuantity: variant?.isOnStock ? variant.availableQuantity : 0,
    model: variant?.sku,
  } as Product;
};
