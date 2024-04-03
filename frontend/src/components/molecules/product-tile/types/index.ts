import { Product } from '@/types/entity/product';

export type ProductTileVariant = 'grid-item' | 'list-item';

export interface ProductTileProps {
  item: Product;
  variant?: ProductTileVariant;
  addToCartDisabled?: boolean;
  onAddToCart?: (qty: number) => Promise<void>;
  className?: string;
}
