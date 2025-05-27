import { ImageProps } from '@/components/atoms/Image/types';
import { Wishlist } from '@shared/types/wishlist/Wishlist';

export interface DataSourceProps {
  wishlist: { items: [Wishlist] };
}

export interface PurchaseListDetailProps {
  image: ImageProps;
}
