import { PurchaseListsPageProps } from '../../types';

export interface Props extends PurchaseListsPageProps {
  id?: string;
  onCancel?: () => void;
  onSave?: () => void;
}
