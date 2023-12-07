import { TableHTMLAttributes } from 'react';
import { classnames } from '@/utils/classnames/classnames';

const TableBody = ({ className, ...props }: TableHTMLAttributes<HTMLTableSectionElement>) => {
  const bodyClassName = classnames('[&>td]:text-gray-600', className);

  return <tbody className={bodyClassName} {...props} />;
};

export default TableBody;
