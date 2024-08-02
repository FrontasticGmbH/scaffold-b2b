import { Variant } from '@shared/types/product';
import { Product as CsvProduct } from '@/components/organisms/quick-order/types';

export const mapCsvProduct = (variant: Variant): CsvProduct => {
  return {
    sku: variant.sku,
    quantity: variant.availableQuantity ?? 0,
    inStock: variant.isOnStock,
    exists: true,
  } as CsvProduct;
};
