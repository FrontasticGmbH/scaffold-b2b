import { PurchaseList } from '@/types/entity/purchase-list';
import { EntityFormProps } from '@/components/organisms/entity-form/types';

export interface PurchaseListsPageProps extends Pick<EntityFormProps, 'classNames'> {
  purchaseLists: PurchaseList[];
  onAddPurchaseList?: (list: PurchaseList) => Promise<void>;
  onUpdatePurchaseList?: (list: Partial<PurchaseList>) => Promise<void>;
}
