import { Meta, StoryFn } from '@storybook/react';
import Blog from '.';

export default {
  title: 'Molecules/Blog',
  component: Blog,
} as Meta<typeof Blog>;

const Template: StoryFn<typeof Blog> = (args) => <Blog {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  image: {
    src: '/car.png',
  },
  title: 'mundial hybrid system',
  description:
    'Combines the efficiency of electric power with the range and convenience of a traditional combustion engine. With its seamless integration and intelligent energy management the _**Mundial**_ hybrid system offers an eco-friendly driving experience.',
  link: {
    name: 'Shop MUNDIAL',
    href: '/mundial',
  },
};
