import { TableHTMLAttributes } from 'react';
import { SelectProps } from '@/components/atoms/select/types';

export type TableCellProps = TableHTMLAttributes<HTMLTableCellElement> & {
  sortable?: boolean;
  isButtonsCell?: boolean;
  onSorting?: () => void;
  as?: 'th' | 'td';
};

export type TableRowProps = TableHTMLAttributes<HTMLTableRowElement>;

export type TablePaginationProps = {
  className?: string;
  page: number;
  limit: number;
  totalItems: number;
  onRowsPerPageChange?: SelectProps['onChange'];
  onPrevious?: () => void;
  onNext?: () => void;
};
