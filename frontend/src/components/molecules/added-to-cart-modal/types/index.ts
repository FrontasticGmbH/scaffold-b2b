import { Product } from '@/types/entity/product';

export type Wishlist = { label: string; id: string };

export type AddedToCartModalProps = {
  item: Product;
  onClose: () => void;
  onQuantityChange: (amount: number) => void;
  sliderProducts: Product[];
};

export type FreqBoughtSliderProps = {
  headline?: string;
  products: Product[];
};
export type ProductTileProps = { product: Product };

export type ItemPricingProps = {
  item: Product;
  quantity?: number;
  onQuantityChange: (value: number) => void;
};
