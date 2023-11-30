import { Meta, StoryFn } from '@storybook/react';
import { EyeSlashIcon as InputIcon } from '@heroicons/react/24/outline';
import Input from '.';

export default {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    requiredStyle: {
      control: 'select',
      options: ['asterisk', 'label'],
    },
  },
} as Meta<typeof Input>;

const Template: StoryFn<typeof Input> = ({ label = 'Label', ...args }) => <Input label={label} {...args} />;

export const Default = Template.bind({});

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  value: 'Label',
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  readOnly: true,
  value: 'Label',
};

export const WithClearButton = Template.bind({});
WithClearButton.args = {
  clearButton: true,
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

export const WithIcon = Template.bind({});
WithIcon.args = {
  icon: <InputIcon width={16} />,
  type: 'password',
};

export const UnStyled = Template.bind({});
UnStyled.args = {
  unStyled: true,
  label: '',
  placeholder: 'Search here..',
};
