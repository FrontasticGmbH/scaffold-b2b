import { PurchaseListItem } from '@/types/entity/purchase-list';

export interface PurchaseListItemProps {
  item: PurchaseListItem;
  onRemove?: () => Promise<boolean>;
  onAddToCart?: () => Promise<boolean>;
  onQuantityChange?: (qty: number) => Promise<boolean>;
}
