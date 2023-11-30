import { Meta, StoryFn } from '@storybook/react';
import PasswordInput from '.';

export default {
  title: 'Atoms/Password Input',
  component: PasswordInput,
  tags: ['autodocs'],
} as Meta<typeof PasswordInput>;

const Template: StoryFn<typeof PasswordInput> = ({ label = 'Password', ...args }) => (
  <PasswordInput label={label} {...args} />
);

export const Default = Template.bind({});
Default.args = {
  required: true,
};
