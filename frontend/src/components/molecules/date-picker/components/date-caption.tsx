import { useCallback } from 'react';
import Button from '@/components/atoms/button';
import Select from '@/components/atoms/select';
import { SelectProps } from '@/components/atoms/select/types';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { CaptionProps, useDayPicker, useNavigation } from 'react-day-picker';

const DateCaption = ({ displayMonth }: CaptionProps) => {
  const { goToMonth, goToDate, nextMonth, previousMonth } = useNavigation();
  const { fromYear, toYear } = useDayPicker();

  const goToYear = (year: string) => {
    const selectedYear = parseInt(year, 10);
    const month = displayMonth.getMonth();
    const newDate = new Date(selectedYear, month, 1);
    goToDate(newDate);
  };

  const getYearOptions = useCallback(() => {
    const startYear = fromYear ?? new Date().getFullYear() - 5;
    const yearsRange = toYear ? toYear - startYear : 10;

    const yearOptions: SelectProps['options'] = Array.from({ length: yearsRange }, (_, index) => {
      const year = (startYear + index).toString();
      return { name: `${format(displayMonth, 'MMMM')} ${year}`, value: year };
    });

    return yearOptions;
  }, [displayMonth, fromYear, toYear]);

  return (
    <div className="flex items-center justify-between">
      <Select defaultValue={displayMonth.getFullYear().toString()} options={getYearOptions()} onChange={goToYear} />

      <div className="flex gap-2">
        <Button data-testid="prev" variant="ghost" size="fit" onClick={() => previousMonth && goToMonth(previousMonth)}>
          <ChevronLeftIcon className="size-5" />
        </Button>
        <Button data-testid="next" variant="ghost" size="fit" onClick={() => nextMonth && goToMonth(nextMonth)}>
          <ChevronRightIcon className="size-5" />
        </Button>
      </div>
    </div>
  );
};

export default DateCaption;
