import { TableHTMLAttributes } from 'react';

export type TableCellProps = TableHTMLAttributes<HTMLTableCellElement> & {
  sortable?: boolean;
  onSorting?: () => void;
};
