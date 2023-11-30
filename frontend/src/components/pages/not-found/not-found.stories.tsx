import { Meta, StoryFn } from '@storybook/react';
import NotFound from '.';

export default {
  title: 'Pages/Not Found',
  component: NotFound,
} as Meta<typeof NotFound>;

const Template: StoryFn<typeof NotFound> = (args) => <NotFound {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  title: 'Page not found',
  summary: 'Sorry, the page you requested could not be found.',
  link: {
    name: 'Return home',
    href: '/',
  },
};
