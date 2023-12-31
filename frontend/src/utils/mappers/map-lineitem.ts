import { Product } from '@/types/entity/product';
import { LineItem } from '@shared/types/cart/LineItem';

export const mapLineItem = (lineItem: LineItem): Product => {
  const variant = lineItem.variant;

  return {
    id: lineItem.productId,
    sku: variant?.sku,
    name: lineItem.name,
    description: variant?.attributes?.['Product-Specifications'],
    images: variant?.images,
    quantity: lineItem.count,
    price: (variant?.price?.centAmount ?? 0) / Math.pow(10, variant?.price?.fractionDigits ?? 2),
    discountedPrice: (variant?.discountedPrice?.centAmount ?? 0) / Math.pow(10, variant?.price?.fractionDigits ?? 2),
    currency: variant?.price?.currencyCode ?? 'USD',
    inStock: variant?.isOnStock,
    maxQuantity: variant?.isOnStock ? Infinity : 0,
    model: variant?.sku,
  } as Product;
};
