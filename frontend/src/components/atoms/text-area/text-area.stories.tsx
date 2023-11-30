import { Meta, StoryFn } from '@storybook/react';
import TextArea from '.';

export default {
  title: 'Atoms/Text Area',
  component: TextArea,
  tags: ['autodocs'],
  argTypes: {
    requiredStyle: {
      control: 'select',
      options: ['asterisk', 'label'],
    },
  },
} as Meta<typeof TextArea>;

const Template: StoryFn<typeof TextArea> = ({ label = 'Description', rows = 8, ...args }) => (
  <TextArea label={label} rows={rows} {...args} />
);

export const Default = Template.bind({});

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  value: 'Description',
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  readOnly: true,
  value: 'Description',
};

export const Invalid = Template.bind({});
Invalid.args = {
  required: true,
  requiredStyle: 'asterisk',
  error: 'Please fill out this field!',
};

export const Valid = Template.bind({});
Valid.args = {
  valid: true,
};
