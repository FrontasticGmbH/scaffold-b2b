import { Product } from '@shared/types/product';
import { Product as CsvProduct } from '@/components/organisms/quick-order/types';

export const mapCsvProduct = (product: Product): CsvProduct => {
  return {
    sku: product.variants[0].sku,
    quantity: product.variants[0].availableQuantity ?? 0,
    inStock: product.variants[0].isOnStock,
    exists: true,
  } as CsvProduct;
};
