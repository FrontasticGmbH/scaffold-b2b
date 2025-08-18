import { ImageProps } from '@/components/atoms/Image/types';
import { PurchaseList, PurchaseListItem } from '@/types/entity/purchase-list';
import { Permission } from '@shared/types/business-unit/Associate';

export interface PurchaseListDetailPageProps {
  purchaseList: PurchaseList;
  onUpdatePurchaseList?: (list: Partial<PurchaseList>) => Promise<boolean>;
  onDeletePurchaseList?: (id: string) => Promise<boolean>;
  onAddPurchaseListToCart?: () => Promise<boolean>;
  onRemoveItem?: (id: string) => Promise<boolean>;
  onAddItemToCart?: (item: Partial<PurchaseListItem>) => Promise<boolean>;
  onUpdateItem?: (item: Partial<PurchaseListItem>) => Promise<boolean>;
  image?: ImageProps;
  permissions?: Record<Permission, boolean>;
  accountId?: string;
  disabled?: boolean;
}
