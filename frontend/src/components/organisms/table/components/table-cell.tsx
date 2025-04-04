import { useMemo } from 'react';
import { classnames } from '@/utils/classnames/classnames';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { TableCellProps } from '../types';

const TableCell = ({
  className,
  sortable,
  isButtonsCell = false,
  onSorting,
  children = ' ',
  as = 'td',
  ...props
}: TableCellProps) => {
  const Cell = as;
  const isHeadCell = as === 'th';

  const cellClassName = classnames(
    'p-4',
    { 'cursor-pointer': !!sortable },
    { 'bg-white': isButtonsCell },
    {
      'sticky right-0 z-10 lg:block lg:bg-transparent': isButtonsCell,
    },
    { 'text-right': typeof children == 'number' },
    className,
  );

  const asTypography = useMemo(
    () => (
      <span
        className={classnames(
          'leading-[20px]',
          { 'text-12 font-semibold': isHeadCell },
          { 'text-14 font-normal': !isHeadCell },
        )}
      >
        {children as string}
      </span>
    ),
    [children],
  );

  const childrenContainer = useMemo(() => {
    if (sortable) {
      return (
        <button onClick={onSorting} className="flex gap-2">
          {asTypography}
          <ChevronUpDownIcon className="hidden size-5 stroke-gray-500 lg:block" />
        </button>
      );
    } else if (typeof children === 'string') return asTypography;
    else return children;
  }, [asTypography, children, onSorting, sortable]);

  return (
    <Cell className={cellClassName} {...props}>
      {childrenContainer}
    </Cell>
  );
};

export default TableCell;
