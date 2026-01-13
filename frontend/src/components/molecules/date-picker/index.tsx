'use client';

import { CaptionProps, DayPicker, DayPickerProps } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import DateCaption from './components/date-caption';
import './styles/index.css';

const DatePicker = ({ fromYear, toYear, ...props }: DayPickerProps) => {
  // Create a wrapper component for MonthCaption that includes fromYear and toYear
  const MonthCaptionWithYears = (captionProps: CaptionProps) => (
    <DateCaption {...captionProps} fromYear={fromYear} toYear={toYear} />
  );

  return (
    <DayPicker
      {...props}
      fromYear={fromYear}
      toYear={toYear}
      components={{
        MonthCaption: MonthCaptionWithYears,
      }}
    />
  );
};

export default DatePicker;
