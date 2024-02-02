import { Option } from '@/components/atoms/select/types';
import { TablePaginationProps } from '@/components/atoms/table/types';
import { Order } from '@/types/entity/order';

export interface OrdersPageProps {
  orders: Order[];
  totalItems: number;
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
  page: number;
  onPageChange?: (page: number) => void;
  limit: number;
  onRowsPerPageChange?: TablePaginationProps['onRowsPerPageChange'];
}
