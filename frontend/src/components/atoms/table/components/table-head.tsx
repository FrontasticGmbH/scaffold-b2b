import { FC, TableHTMLAttributes } from 'react';
import { classnames } from '@/utils/classnames/classnames';

const TableHead: FC<TableHTMLAttributes<HTMLTableSectionElement>> = ({ className, children, ...props }) => {
  const headClassName = classnames('bg-neutral-300/20 uppercase shadow-[0px_-1px_0px_0px_#E4E4E7_inset]', className);
  return (
    <thead className={headClassName} {...props}>
      <tr>{children}</tr>
    </thead>
  );
};

export default TableHead;
