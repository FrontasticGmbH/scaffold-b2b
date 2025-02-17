import { classnames } from '@/utils/classnames/classnames';
import TableCell from './table-cell';
import { TableCellProps } from '../types';

const TableHeaderCell = ({ className, children, ...props }: TableCellProps) => {
  const headClassName = classnames('whitespace-pre bg-gray-100 text-left text-gray-500', className);

  return (
    <TableCell as="th" className={headClassName} {...props}>
      {children}
    </TableCell>
  );
};

export default TableHeaderCell;
