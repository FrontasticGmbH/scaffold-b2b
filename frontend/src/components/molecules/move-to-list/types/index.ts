import { Wishlist } from '@shared/types/wishlist';

export type MoveToListProps = {
  lists: { label: string; id: string }[];
  disabled?: boolean;
  onSubmit?: (selected: string[]) => Promise<void>;
  onAddNewList?: (list: Pick<Wishlist, 'name' | 'description' | 'store'>) => Promise<void>;
};
