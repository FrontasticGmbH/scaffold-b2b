import { PurchaseList } from '@/types/entity/purchase-list';

export type MoveToListProps = {
  lists: { label: string; id: string }[];
  disabled?: boolean;
  onSubmit?: (selected: string[]) => Promise<void>;
  onAddNewList?: (list: Pick<PurchaseList, 'name' | 'description' | 'store'>) => Promise<void>;
};
