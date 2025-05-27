import { TableHTMLAttributes } from 'react';
import { classnames } from '@/utils/classnames/classnames';

const TableContainer = ({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) => {
  const tableClassName = classnames('relative table w-full overflow-x-auto', className);
  return <table className={tableClassName} {...props} />;
};

export default TableContainer;
