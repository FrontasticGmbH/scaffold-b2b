import { Wishlist } from '@shared/types/wishlist/Wishlist';

export interface DataSourceProps {
  wishlist: { items: [Wishlist] };
}
