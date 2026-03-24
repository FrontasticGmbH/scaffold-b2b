'use client';

import React from 'react';
import { DayPicker, DayPickerProps } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './styles/index.css';
import DateCaption from './components/date-caption';

const DatePicker = ({ fromYear, toYear, ...props }: DayPickerProps) => {
  return (
    <DayPicker
      {...props}
      fromYear={fromYear}
      toYear={toYear}
      components={{
        Caption: DateCaption,
      }}
    />
  );
};

export default DatePicker;
