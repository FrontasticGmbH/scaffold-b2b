import { TableHTMLAttributes } from 'react';
import { classnames } from '@/utils/classnames/classnames';

const TableHead = ({ className, children, ...props }: TableHTMLAttributes<HTMLTableSectionElement>) => {
  const headClassName = classnames('bg-gray-100 uppercase', className);
  return (
    <thead className={headClassName} {...props}>
      {children}
    </thead>
  );
};

export default TableHead;
