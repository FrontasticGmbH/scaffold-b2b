import { PurchaseList } from '@/types/entity/purchase-list';
import { EntityFormProps } from '@/components/organisms/entity-form/types';
import { ImageProps } from '@/components/atoms/Image/types';
import { Permission } from '@shared/types/business-unit/Associate';

export interface PurchaseListsPageProps extends Pick<EntityFormProps, 'classNames'> {
  purchaseLists: PurchaseList[];
  loading?: boolean;
  image?: ImageProps;
  onAddPurchaseList?: (list: PurchaseList) => Promise<boolean>;
  onUpdatePurchaseList?: (list: Partial<PurchaseList>) => Promise<boolean>;
  permissionImage?: ImageProps;
  permissions?: Record<Permission, boolean>;
}
