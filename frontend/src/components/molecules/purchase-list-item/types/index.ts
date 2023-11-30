import { PurchaseListItem } from '@/types/entity/purchase-list';

export interface PurchaseListItemProps {
  item: PurchaseListItem;
  onRemove?: () => Promise<void>;
  onAddToCart?: () => Promise<void>;
  onQuantityChange?: (qty: number) => Promise<void>;
}
