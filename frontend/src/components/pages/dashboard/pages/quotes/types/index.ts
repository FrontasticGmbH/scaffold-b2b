import { Option } from '@/components/atoms/select/types';
import { TablePaginationProps } from '@/components/organisms/table/types';
import { Quote } from '@/types/entity/quote';

export interface QuotesPage {
  quotes: Array<Quote & { url: string }>;
  loading?: boolean;
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
  onPageChange?: (page: number) => void;
  onSelectedChange?: (selected: 'quotes' | 'quotes.requests') => void;
}

export type QuotesPageProps = QuotesPage & TablePaginationProps;
