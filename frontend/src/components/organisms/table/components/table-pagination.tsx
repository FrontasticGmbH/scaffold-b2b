import { SVGAttributes, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { classnames } from '@/utils/classnames/classnames';
import Typography from '@/components/atoms/typography';
import Select from '@/components/atoms/select';
import { TablePaginationProps } from '../types';

const TablePagination = ({
  className,
  page = 1,
  limit = 25,
  totalItems = 0,
  onRowsPerPageChange,
  onPrevious,
  onNext,
}: TablePaginationProps) => {
  const { translate } = useTranslation();

  const { from, to } = useMemo(() => {
    const from = totalItems === 0 ? '0' : ((page - 1) * limit + 1).toString();
    const to = Math.min((page - 1) * limit + limit, totalItems).toString();

    return { from, to };
  }, [limit, page, totalItems]);

  const disableNext = useMemo(() => to === totalItems.toString(), [to, totalItems]);

  const disablePrevious = useMemo(() => page === 1, [page]);

  const previousIconProps: SVGAttributes<SVGElement> = {
    className: classnames('size-6', { 'cursor-pointer': !disablePrevious }),
    stroke: disablePrevious ? '#D1D1D1' : '#212121',
  };

  const nextIconProps: SVGAttributes<SVGElement> = {
    className: classnames('size-6', { 'cursor-pointer': !disableNext }),
    stroke: disableNext ? '#D1D1D1' : '#212121',
  };

  const paginationClassName = classnames('flex w-full justify-between py-6 md:gap-0', className);

  return (
    <div className={paginationClassName}>
      <div className="flex items-center gap-2">
        <Typography fontSize={14} className="text-gray-700 md:hidden">
          {translate('common.rows')}
        </Typography>
        <Typography fontSize={14} className="hidden text-gray-700 md:block">
          {translate('common.rows.per.page')}
        </Typography>
        <Select
          onChange={onRowsPerPageChange}
          value={limit.toString()}
          options={[
            { name: '25', value: '25' },
            { name: '50', value: '50' },
            { name: '100', value: '100' },
            { name: 'All', value: totalItems.toString() },
          ]}
        />
      </div>
      <div className="flex items-center gap-3 md:gap-9">
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
          <ChevronLeftIcon
            data-testid="previous-arrow"
            data-disabled={disablePrevious}
            stroke="#212121"
            {...previousIconProps}
            onClick={onPrevious}
          />
          <ChevronRightIcon
            data-testid="next-arrow"
            data-disabled={disableNext}
            stroke="#212121"
            {...nextIconProps}
            onClick={onNext}
          />
        </div>
      </div>
    </div>
  );
};
export default TablePagination;
