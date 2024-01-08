import { Product, Variant } from '@shared/types/product';
import { Product as EntityProduct } from '@/types/entity/product';
import { Currency } from '@/types/currency';

export const mapProduct = (product: Product): EntityProduct => {
  const variant =
    product.variants.find(
      (v) =>
        !!v.discountedPrice?.centAmount && !!v.price?.centAmount && v.discountedPrice.centAmount < v.price?.centAmount,
    ) ?? product.variants[0];

  const cheapeastVariant = product.variants.reduce(
    (a, b) => ((a.price?.centAmount ?? Number.MAX_VALUE) < (b.price?.centAmount ?? Number.MAX_VALUE) ? a : b),
    {
      price: { centAmount: Number.MAX_VALUE },
    } as Variant,
  );

  const mostExpensiveVariant = product.variants.reduce(
    (a, b) => ((a.price?.centAmount ?? Number.MIN_VALUE) > (b.price?.centAmount ?? Number.MIN_VALUE) ? a : b),
    {
      price: { centAmount: Number.MIN_VALUE },
    } as Variant,
  );

  const priceRange =
    cheapeastVariant &&
    mostExpensiveVariant &&
    cheapeastVariant.price?.centAmount !== mostExpensiveVariant.price?.centAmount
      ? ([
          (cheapeastVariant.price?.centAmount ?? 0) / Math.pow(10, cheapeastVariant.price?.fractionDigits ?? 2),
          (mostExpensiveVariant.price?.centAmount ?? 0) / Math.pow(10, mostExpensiveVariant.price?.fractionDigits ?? 2),
        ] as [number, number])
      : undefined;

  return {
    id: product.productId ?? '',
    sku: variant.sku,
    name: product.name ?? '',
    description: variant.attributes?.['Product-Specifications'],
    images: variant.images,
    price: (variant.price?.centAmount ?? 0) / Math.pow(10, variant.price?.fractionDigits ?? 2),
    discountedPrice: (variant.discountedPrice?.centAmount ?? 0) / Math.pow(10, variant.price?.fractionDigits ?? 2),
    currency: (variant.price?.currencyCode ?? 'USD') as Currency,
    inStock: variant.isOnStock,
    maxQuantity: variant.isOnStock ? variant.availableQuantity : 0,
    model: variant.sku,
    ...(priceRange ? { priceRange } : {}),
    url: product._url,
  };
};
