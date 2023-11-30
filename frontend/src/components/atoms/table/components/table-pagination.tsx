import { FC, SVGAttributes, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Typography from '../../typography';
import Select from '../../select';
import { SelectProps } from '../../select/types';

export type TablePaginationProps = {
  page: number;
  limit: number;
  totalItems: number;
  onRowsPerPageChange?: SelectProps['onChange'];
  onPrevious?: () => void;
  onNext?: () => void;
};

const TablePagination: FC<TablePaginationProps> = ({
  page,
  limit,
  totalItems,
  onRowsPerPageChange,
  onPrevious,
  onNext,
}) => {
  const { translate } = useTranslation();

  const { from, to } = useMemo(() => {
    const from = (page * limit + 1).toString();
    const to = Math.min(page * limit + limit, totalItems).toString();

    return { from, to };
  }, [limit, page, totalItems]);

  const iconDefaultProps: SVGAttributes<SVGElement> = {
    className: 'h-6 w-6 cursor-pointer',
    stroke: '#212121',
  };

  return (
    <div className="flex w-full justify-between py-6">
      <div className="flex items-center gap-2">
        <Typography fontSize={14} className="text-gray-700">
          {translate('common.rows.per.page')}
        </Typography>
        <Select
          onChange={onRowsPerPageChange}
          value={limit.toString()}
          options={[
            { name: '25', value: '25' },
            { name: '50', value: '50' },
            { name: '100', value: '100' },
            { name: 'All', value: '' },
          ]}
        />
      </div>
      <div className="flex items-center gap-9">
        <Typography fontSize={14} className="text-gray-700">
          {translate('common.from.to', {
            values: {
              from,
              to,
              totalItems: totalItems.toString(),
            },
          })}
        </Typography>
        <div className="flex gap-4">
          <ChevronLeftIcon {...iconDefaultProps} onClick={onPrevious} />
          <ChevronRightIcon {...iconDefaultProps} onClick={onNext} />
        </div>
      </div>
    </div>
  );
};
export default TablePagination;
