import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import RefinementDropdown from '.';

export default {
  title: 'Atoms/RefinementDropdown',
  component: RefinementDropdown,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'lg'],
    },
  },
} as Meta<typeof RefinementDropdown>;

const Template: StoryFn<typeof RefinementDropdown> = (args) => {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  return (
    <RefinementDropdown
      {...args}
      options={Array.from({ length: 3 }).map((_, index) => ({
        name: `Option ${index + 1}`,
        value: index.toString(),
        count: (index + 1) * 2,
        selected: selected[index.toString()],
        onSelected: (checked) => setSelected({ ...selected, [index.toString()]: checked }),
      }))}
    >
      Select
    </RefinementDropdown>
  );
};

export const Default = Template.bind({});
