import { Meta, StoryFn } from '@storybook/react';
import Sidebar from '.';

export default {
  title: 'Organisms/Sidebar',
  component: Sidebar,
} as Meta<typeof Sidebar>;

const Template: StoryFn<typeof Sidebar> = (args) => <Sidebar {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  title: 'HELLO, ERIKA!',
  links: [
    { name: 'Dashboard', href: '#', isActive: true },
    { name: 'Orders', href: '#' },
    { name: 'Quotes', href: '#' },
    { name: 'Company Admin', href: '#' },
    { name: 'Purchase Lists', href: '#' },
    { name: 'Settings & Security', href: '#' },
    { name: 'Addresses', href: '#' },
  ],
};
