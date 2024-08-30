import { Meta, StoryFn } from '@storybook/react';
import { blog } from '@/mocks/blog';
import Blog from '.';

export default {
  title: 'Molecules/Blog',
  component: Blog,
} as Meta<typeof Blog>;

const Template: StoryFn<typeof Blog> = (args) => <Blog {...args} />;

export const Primary = Template.bind({});
Primary.args = blog;
