import { FC, TableHTMLAttributes } from 'react';
import { classnames } from '@/utils/classnames/classnames';

const TableContainer: FC<TableHTMLAttributes<HTMLTableElement>> = ({ className, ...props }) => {
  const tableClassName = classnames('w-full', className);
  return <table className={tableClassName} {...props} />;
};

export default TableContainer;
