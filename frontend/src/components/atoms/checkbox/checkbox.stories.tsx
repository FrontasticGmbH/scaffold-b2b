import { Meta, StoryFn } from '@storybook/react';
import Checkbox from '.';

export default {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'lg'],
    },
  },
} as Meta<typeof Checkbox>;

const Template: StoryFn<typeof Checkbox> = ({ label = 'Text', ...args }) => <Checkbox label={label} {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Text',
};

export const Controlled = Template.bind({});
Controlled.args = {
  checked: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  checked: false,
};
