import { Meta, StoryFn } from '@storybook/react';
import Tag from '.';

export default {
  title: 'Atoms/Tag',
  component: Tag,
  tags: ['autodocs'],
} as Meta<typeof Tag>;

const Template: StoryFn<typeof Tag> = (args) => <Tag {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: 'Returned',
  variant: 'primary',
};

export const Secondary = Template.bind({});
Primary.args = {
  children: 'Renogitiated',
  variant: 'secondary',
};

export const Warning = Template.bind({});
Warning.args = {
  children: 'Confirmed',
  variant: 'warning',
};

export const Success = Template.bind({});
Success.args = {
  children: 'Delivered',
  variant: 'success',
};

export const Danger = Template.bind({});
Danger.args = {
  children: 'Cancelled',
  variant: 'danger',
};
