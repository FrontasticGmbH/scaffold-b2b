import { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { DateRange } from 'react-day-picker';
import DatePicker from '.';

export default {
  title: 'Molecules/Date Picker',
  component: DatePicker,
  tags: ['autodocs'],
} as Meta<typeof DatePicker>;

const Template: StoryFn<typeof DatePicker> = () => {
  const [selected, setSelected] = useState<DateRange>();

  return <DatePicker mode="range" selected={selected} onSelect={setSelected} fromYear={2023} toYear={2040} />;
};

export const Default = Template.bind({});
Default.args = {};
