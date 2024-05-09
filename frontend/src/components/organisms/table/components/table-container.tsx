import { TableHTMLAttributes } from 'react';
import { classnames } from '@/utils/classnames/classnames';

const TableContainer = ({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) => {
  const tableClassName = classnames(
    'relative block w-full overflow-x-auto rounded-md border border-neutral-400 md:table',
    className,
  );
  return <table className={tableClassName} {...props} />;
};

export default TableContainer;
