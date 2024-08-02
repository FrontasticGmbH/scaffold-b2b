import { Order } from '@/types/entity/order';

export interface OrderDetailsPageProps {
  order?: Order;
  viewOnly?: boolean;
  showCtaButtons?: boolean;
  showOrderStatusBar?: boolean;
  onReturn?: () => Promise<boolean>;
  onReorder?: () => Promise<boolean>;
}
