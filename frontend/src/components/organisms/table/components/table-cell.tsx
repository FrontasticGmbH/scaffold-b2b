import { useMemo } from 'react';
import { classnames } from '@/utils/classnames/classnames';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import Typography from '@/components/atoms/typography';
import { TableCellProps } from '../types';

const TableCell = ({
  className,
  sortable,
  isButtonsCell = false,
  isButtonsHead = false,
  isHeadCell = false,
  onSorting,
  children = ' ',
  ...props
}: TableCellProps) => {
  const cellClassName = classnames(
    'p-4',
    { 'cursor-pointer': !!sortable },
    { 'bg-white': isButtonsCell },
    { 'whitespace-pre bg-gray-100 ': isButtonsHead },
    { 'text-gray-500 ': isHeadCell },
    {
      'sticky right-0 z-10 lg:block lg:bg-transparent': isButtonsCell || isButtonsHead,
    },
    { 'text-right': typeof children == 'number' },
    className,
  );

  const asTypography = useMemo(
    () => (
      <Typography
        fontSize={isHeadCell ? 12 : 14}
        className="leading-[20px]"
        fontWeight={isHeadCell ? 'semibold' : 'normal'}
      >
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
          <ChevronUpDownIcon onClick={onSorting} className="hidden size-5 stroke-gray-500 lg:block" />
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
