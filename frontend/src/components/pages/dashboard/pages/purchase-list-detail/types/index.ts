import { PurchaseList, PurchaseListItem } from '@/types/entity/purchase-list';

export interface PurchaseListDetailPageProps {
  purchaseList: PurchaseList;
  onUpdatePurchaseList?: (list: Partial<PurchaseList>) => Promise<boolean>;
  onDeletePurchaseList?: (id: string) => Promise<boolean>;
  onOrderPurchaseList?: () => Promise<boolean>;
  onRemoveItem?: (id: string) => Promise<boolean>;
  onAddItemToCart?: (item: Partial<PurchaseListItem>) => Promise<boolean>;
  onUpdateItem?: (item: Partial<PurchaseListItem>) => Promise<boolean>;
}
