import { Product } from '@/types/entity/product';

export interface ProductSliderProps {
  headline?: string;
  products: Product[];
  onAddToCart?: (sku: string) => Promise<void>;
}
