import { Product } from '@/types/entity/product';
import { DataSourceProps, Props } from '../../types';

const useMappedProducts = ({ items }: Partial<DataSourceProps & Props>) => {
  const mappedProducts = (items ?? []).map((item) => {
    const variant =
      item.variants.find(
        (v) =>
          !!v.discountedPrice?.centAmount &&
          !!v.price?.centAmount &&
          v.discountedPrice.centAmount < v.price?.centAmount,
      ) ?? item.variants[0];

    return {
      id: item.productId,
      sku: variant.sku,
      name: item.name,
      description: variant.attributes?.['Product-Specifications'],
      image: variant.images?.[0],
      price:
        (variant.discountedPrice?.centAmount ?? variant.price?.centAmount ?? 0) /
        Math.pow(10, variant.price?.fractionDigits ?? 2),
      currency: variant.price?.currencyCode ?? 'USD',
      inStock: variant.isOnStock,
      maxQuantity: variant.isOnStock ? Infinity : 0,
      model: variant.sku,
    } as Product;
  }) as Product[];

  return mappedProducts;
};

export default useMappedProducts;
