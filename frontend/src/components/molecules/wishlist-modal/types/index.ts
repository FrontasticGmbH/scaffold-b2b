export type Wishlist = { label: string; id: string };

export type WishlistModalProps = {
  lists: Array<Wishlist>;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lists: Array<Wishlist>) => void;
  handleChange: (id: string, checked: boolean) => void;
  selectedIds: string[];
  loading?: boolean;
};
