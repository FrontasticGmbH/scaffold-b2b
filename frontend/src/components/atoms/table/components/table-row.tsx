import { FC, TableHTMLAttributes } from 'react';
import { classnames } from '@/utils/classnames/classnames';

const TableRow: FC<TableHTMLAttributes<HTMLTableRowElement>> = ({ className, ...props }) => {
  const rowClassName = classnames('shadow-[0px_-1px_0px_0px_#E4E4E7_inset]', className);
  return <tr className={rowClassName} {...props}></tr>;
};

export default TableRow;
