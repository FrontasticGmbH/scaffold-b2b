import { Product } from '@/types/entity/product';

export interface ProductSliderProps {
  headline?: string;
  products: Product[];
  addToCartDisabled?: boolean;
  onAddToCart?: (sku: string) => Promise<void>;
}
