import { Option } from '@/components/atoms/select/types';
import { TablePaginationProps } from '@/components/organisms/table/types';
import { Order } from '@/types/entity/order';

interface OrdersPage {
  orders: Order[];
  loading?: boolean;
  filters: {
    sort?: string;
    search?: string;
    status?: string[];
    createdFrom?: string;
    createdTo?: string;
  };
  sortOptions: Option[];
  statusOptions: Array<Option & { count?: number }>;
  onClearRefinements?: () => void;
  onStatusRefine?: (status: string) => void;
  onCreationDateRefine?: (args: { from?: Date; to?: Date }) => void;
  onSearch?: (search: string) => void;
  onSortBy?: (sort: string) => void;
  onPageChange?: (page: number) => void;
}

export type OrdersPageProps = OrdersPage & TablePaginationProps;
