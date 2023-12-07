import { Product } from '@shared/types/product';
import { Product as EntityProduct } from '@/types/entity/product';
import { Currency } from '@/types/currency';

export const mapProduct = (product: Product): EntityProduct => {
  const variant =
    product.variants.find(
      (v) =>
        !!v.discountedPrice?.centAmount && !!v.price?.centAmount && v.discountedPrice.centAmount < v.price?.centAmount,
    ) ?? product.variants[0];

  return {
    id: product.productId ?? '',
    sku: variant.sku,
    name: product.name ?? '',
    description: variant.attributes?.['Product-Specifications'],
    image: variant.images?.[0],
    price: (variant.price?.centAmount ?? 0) / Math.pow(10, variant.price?.fractionDigits ?? 2),
    discountedPrice: (variant.discountedPrice?.centAmount ?? 0) / Math.pow(10, variant.price?.fractionDigits ?? 2),
    currency: (variant.price?.currencyCode ?? 'USD') as Currency,
    inStock: variant.isOnStock,
    maxQuantity: variant.isOnStock ? Infinity : 0,
    model: variant.sku,
  };
};
