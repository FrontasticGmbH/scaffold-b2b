import { Meta, StoryFn } from '@storybook/react';
import Link from '.';

export default {
  title: 'Atoms/Link',
  component: Link,
} as Meta<typeof Link>;

const Template: StoryFn<typeof Link> = (args) => <Link {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  href: '#',
  openInNewTab: false,
  children: 'Click Me!',
};
