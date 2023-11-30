import { FC, useMemo } from 'react';
import { classnames } from '@/utils/classnames/classnames';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import Typography from '../../typography';
import { TableCellProps } from '../types';

const TableCell: FC<TableCellProps> = ({ className, sortable, onSorting, children, ...props }) => {
  const cellClassName = classnames('p-4', { 'cursor-pointer': !!sortable }, className);

  const asTypography = useMemo(
    () => (
      <Typography fontSize={14} className="leading-[20px]">
        {children as string}
      </Typography>
    ),
    [children],
  );

  const childrenContainer = useMemo(() => {
    if (sortable) {
      return (
        <div className="flex gap-2">
          {asTypography}
          <ChevronUpDownIcon onClick={onSorting} className="hidden h-5 w-5 stroke-gray-500 lg:block" />
        </div>
      );
    } else if (typeof children === 'string') return asTypography;
    else return children;
  }, [asTypography, children, onSorting, sortable]);

  return (
    <td className={cellClassName} {...props}>
      {childrenContainer}
    </td>
  );
};

export default TableCell;
