import { Order } from '@/types/entity/order';

export interface DashboardProps {
  orders: Order[];
  hasPendingApprovalFlows?: boolean;
}
