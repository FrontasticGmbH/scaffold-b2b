import { Meta, StoryFn } from '@storybook/react';
import MultiSelect from '.';

export default {
  title: 'Atoms/Multi Select',
  component: MultiSelect,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'multi-select',
      options: ['sm', 'lg'],
    },
  },
} as Meta<typeof MultiSelect>;

const Template: StoryFn<typeof MultiSelect> = (args) => <MultiSelect {...args} />;

const options = Array.from({ length: 10 }, (_, index) => ({ name: `Option ${index + 1}`, value: index.toString() }));

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Select',
  options,
};

export const Labelled = Template.bind({});
Labelled.args = {
  label: 'Label',
  placeholder: 'Select',
  options,
};

export const Controlled = Template.bind({});
Controlled.args = {
  value: ['0', '1', '3', '5'],
  options,
};

export const Disabled = Template.bind({});
Disabled.args = {
  placeholder: 'Select',
  disabled: true,
};

export const WithSearch = Template.bind({});
WithSearch.args = {
  placeholder: 'Select',
  enableSearch: true,
  options,
};
