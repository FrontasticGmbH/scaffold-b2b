'use client';

import React, { FC } from 'react';
import { DayPicker, DayPickerProps } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './styles/index.css';

export const DatePicker: FC<DayPickerProps> = ({ ...props }) => {
  return <DayPicker captionLayout="dropdown" modifiersClassNames={{ outside: 'custom-disabled' }} {...props} />;
};

export default DatePicker;
