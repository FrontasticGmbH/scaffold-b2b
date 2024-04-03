import { ProductSuggestion } from '@/components/organisms/search/types';
import { Product } from '@shared/types/product';

export const mapProductSuggestion = (product: Product): ProductSuggestion => {
  const variant = product.variants[0];

  return {
    id: product.productId,
    sku: variant?.sku ?? '',
    name: product.name ?? '',
    description: variant?.attributes?.['Product-Specifications'],
    image: variant?.images?.[0],
    url: product._url,
  } as ProductSuggestion;
};
