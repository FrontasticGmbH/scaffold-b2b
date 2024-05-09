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
  onSorting,
  children,
  ...props
}: TableCellProps) => {
  const cellClassName = classnames(
    'p-4',
    { 'cursor-pointer': !!sortable },
    { 'bg-white': isButtonsCell },
    { 'bg-[#FCFCFD]': isButtonsHead },
    { 'shadow-[0px_-1px_0px_0px_#E4E4E7_inset] lg:shadow-none': isButtonsCell || isButtonsHead },
    {
      'sticky right-0 z-10 lg:block lg:bg-transparent': isButtonsCell || isButtonsHead,
    },
    { 'text-right': typeof children == 'number' },
    className,
  );

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
