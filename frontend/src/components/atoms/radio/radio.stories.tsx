import { Meta, StoryFn } from '@storybook/react';
import Radio from '.';

export default {
  title: 'Atoms/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'lg'],
    },
  },
} as Meta<typeof Radio>;

const Template: StoryFn<typeof Radio> = ({ label = 'Text', ...args }) => <Radio label={label} {...args} />;

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
