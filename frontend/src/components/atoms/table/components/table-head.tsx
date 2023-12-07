import { TableHTMLAttributes } from 'react';
import { classnames } from '@/utils/classnames/classnames';

const TableHead = ({ className, children, ...props }: TableHTMLAttributes<HTMLTableSectionElement>) => {
  const headClassName = classnames('bg-[#FCFCFD] uppercase shadow-[0px_-1px_0px_0px_#E4E4E7_inset]', className);
  return (
    <thead className={headClassName} {...props}>
      {children}
    </thead>
  );
};

export default TableHead;
