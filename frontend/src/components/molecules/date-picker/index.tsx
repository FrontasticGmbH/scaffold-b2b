'use client';

import React from 'react';
import { DayPicker, DayPickerProps, DayPickerProvider, NavigationProvider } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './styles/index.css';
import DateCaption from './components/date-caption';

const DatePicker = ({ fromYear, toYear, ...props }: DayPickerProps) => {
  return (
    <DayPickerProvider initialProps={{ fromYear, toYear }}>
      <NavigationProvider>
        <DayPicker
          {...props}
          components={{
            Caption: DateCaption,
          }}
        />
      </NavigationProvider>
    </DayPickerProvider>
  );
};
export default DatePicker;
