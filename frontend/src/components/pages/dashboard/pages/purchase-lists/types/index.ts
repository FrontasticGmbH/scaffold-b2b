import { PurchaseList } from '@/types/entity/purchase-list';
import { EntityFormProps } from '@/components/organisms/entity-form/types';

export interface PurchaseListsPageProps extends Pick<EntityFormProps, 'classNames'> {
  purchaseLists: PurchaseList[];
  loading?: boolean;
  onAddPurchaseList?: (list: PurchaseList) => Promise<boolean>;
  onUpdatePurchaseList?: (list: Partial<PurchaseList>) => Promise<boolean>;
}
