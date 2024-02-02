import { Product } from '@/types/entity/product';

export interface AddToCartOverlayContextShape {
  showModal: (product: Product) => void;
}
