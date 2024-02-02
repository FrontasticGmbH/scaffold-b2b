import { Order } from '@/types/entity/order';

export interface OrderDetailsPageProps {
  order?: Order;
  onReturn?: () => Promise<boolean>;
  onReorder?: () => Promise<boolean>;
}
