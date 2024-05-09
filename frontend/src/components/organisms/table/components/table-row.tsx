import { classnames } from '@/utils/classnames/classnames';
import { TableRowProps } from '../types';

const TableRow = ({ className, ...props }: TableRowProps) => {
  const rowClassName = classnames(
    'whitespace-nowrap shadow-[0px_-1px_0px_0px_#E4E4E7_inset] last:shadow-none',
    className,
  );
  return <tr className={rowClassName} {...props}></tr>;
};

export default TableRow;
