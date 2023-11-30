import { Meta, StoryFn } from '@storybook/react';
import Select from '.';

export default {
  title: 'Atoms/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'lg'],
    },
  },
} as Meta<typeof Select>;

const Template: StoryFn<typeof Select> = (args) => <Select {...args} />;

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
  value: '0',
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
