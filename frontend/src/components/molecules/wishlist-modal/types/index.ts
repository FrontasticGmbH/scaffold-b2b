import { PurchaseList } from '@/types/entity/purchase-list';

export type Wishlist = { label: string; id: string };
export type ListWishListsProps = {
  lists: Array<Wishlist>;
  isOpen: boolean;
  onSubmit: (lists: Array<Wishlist>) => void;
  selectedIds: string[];
  handleChange: (id: string, checked: boolean) => void;
  loading?: boolean;
  onClose: () => void;
};
export type AddToNewWishlistProps = {
  onAddToNewList?: (
    list: Pick<PurchaseList, 'name' | 'description' | 'store'>,
    count?: number,
    sku?: string,
  ) => Promise<void>;
  onClose: () => void;
};

export type WishlistModalProps = ListWishListsProps & AddToNewWishlistProps;
