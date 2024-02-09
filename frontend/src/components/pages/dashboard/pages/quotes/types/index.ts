import { Option } from '@/components/atoms/select/types';
import { TablePaginationProps } from '@/components/atoms/table/types';
import { Quote } from '@/types/entity/quote';

export interface QuotesPageProps {
  quotes: Array<Quote & { url: string }>;
  totalItems: number;
  filters: {
    sort?: string;
    search?: string;
    status?: string[];
    creationDate?: string;
  };
  sortOptions: Option[];
  statusOptions: Array<Option & { count?: number }>;
  onClearRefinements?: () => void;
  onStatusRefine?: (status: string) => void;
  onCreationDateRefine?: (date: string) => void;
  onSearch?: (search: string) => void;
  onSortBy?: (sort: string) => void;
  page: number;
  onPageChange?: (page: number) => void;
  limit: number;
  onRowsPerPageChange?: TablePaginationProps['onRowsPerPageChange'];
  onSelectedChange?: (selected: 'quotes' | 'quotes.requests') => void;
}
