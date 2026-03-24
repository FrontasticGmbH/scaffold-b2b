import { Product, Variant } from '@shared/types/product';
import { Attribute, Product as EntityProduct } from '@/types/entity/product';
import { Currency } from '@/types/currency';
import { Cart } from '@shared/types/cart';
import { Locale } from '@/project.config';
import { mapMasterAttributes } from './map-master-attributes';
import { mapCategory } from './map-category';
import { mapAttribute } from './map-attribute';

export const mapProduct = (
  product: Product,
  {
    variantIndex = -1,
    cart,
    locale = 'en-us',
    filterOutNonMatchingVariants = true,
  }: { variantIndex?: number; cart?: Cart; locale?: Locale; filterOutNonMatchingVariants?: boolean } = {},
): EntityProduct => {
  const variant =
    product.variants[variantIndex] ??
    product.variants.find(
      (v) =>
        !!v.discountedPrice?.value?.centAmount &&
        !!v.price?.centAmount &&
        v.discountedPrice.value.centAmount < v.price?.centAmount,
    ) ??
    product.variants[0];

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

  const colors = product.variants
    .filter((variant) => (filterOutNonMatchingVariants ? variant.isMatchingVariant !== false : true))
    .map((v) => mapAttribute(v.attributes?.color))
    .filter(Boolean) as Attribute[];
  //   Temporary until correct mapping is done for the model attribute
  const specs = product.variants
    .filter((variant) => (filterOutNonMatchingVariants ? variant.isMatchingVariant !== false : true))
    .map((v) => mapAttribute({ label: v.attributes?.model, key: v.attributes?.model }))
    .filter(Boolean) as Attribute[];

  const specifications = mapMasterAttributes(variant);

  const priceRange =
    cheapeastVariant &&
    mostExpensiveVariant &&
    cheapeastVariant.price?.centAmount !== mostExpensiveVariant.price?.centAmount
      ? ([
          (cheapeastVariant.price?.centAmount ?? 0) / Math.pow(10, cheapeastVariant.price?.fractionDigits ?? 2),
          (mostExpensiveVariant.price?.centAmount ?? 0) / Math.pow(10, mostExpensiveVariant.price?.fractionDigits ?? 2),
        ] as [number, number])
      : undefined;

  const inCartQuantity = cart?.lineItems?.find((lineItem) => lineItem.variant?.sku === variant.sku)?.count ?? 0;

  return {
    id: product.productId ?? '',
    key: product.productKey,
    ref: product.productRef,
    sku: variant.sku,
    name: product.name ?? '',
    description: product.description,
    specifications,
    images: variant.images,
    colors,
    specs,
    price: (variant.price?.centAmount ?? 0) / Math.pow(10, variant.price?.fractionDigits ?? 2),
    discountedPrice:
      (variant.discountedPrice?.value?.centAmount ?? 0) / Math.pow(10, variant.price?.fractionDigits ?? 2),
    currency: (variant.price?.currencyCode ?? 'USD') as Currency,
    inStock: variant.isOnStock,
    maxQuantity: variant.isOnStock ? Math.max(0, (variant.availableQuantity ?? Number.MAX_VALUE) - inCartQuantity) : 0,
    ...(priceRange ? { priceRange } : {}),
    url: product._url,
    categories: product.categories?.map((c) => mapCategory(c, { locale })) ?? [],
  };
};
