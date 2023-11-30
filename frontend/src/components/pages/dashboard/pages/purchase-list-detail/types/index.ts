import { PurchaseList, PurchaseListItem } from '@/types/entity/purchase-list';

export interface PurchaseListDetailPageProps {
  purchaseList: PurchaseList;
  onUpdatePurchaseList?: (list: Partial<PurchaseList>) => Promise<void>;
  onDeletePurchaseList?: (id: string) => Promise<void>;
  onOrderPurchaseList?: (id: string) => Promise<void>;
  onRemoveItem?: (id: string) => Promise<void>;
  onAddItemToCart?: (item: Partial<PurchaseListItem>) => Promise<void>;
  onUpdateItem?: (item: Partial<PurchaseListItem>) => Promise<void>;
}
