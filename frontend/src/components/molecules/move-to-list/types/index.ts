import { PurchaseList } from '@/types/entity/purchase-list';
import { Wishlist } from '@shared/types/wishlist/Wishlist';

export type MoveToListProps = {
  lists: { label: string; id: string }[];
  disabled?: boolean;
  onSubmit?: (selected: string[]) => Promise<void>;
  onAddNewList?: (list: Pick<PurchaseList, 'name' | 'description' | 'store'>) => Promise<Wishlist | null>;
};
