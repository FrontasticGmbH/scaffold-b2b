import { Meta, StoryFn } from '@storybook/react';
import AnnouncementBar from '.';

export default {
  title: 'Organisms/Announcement Bar',
  component: AnnouncementBar,
} as Meta<typeof AnnouncementBar>;

const Template: StoryFn<typeof AnnouncementBar> = (args) => <AnnouncementBar {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  name: 'Erika',
  onLogoutClick: () => {},
  textBar: 'Worldwide shipping & returns *',
  quotes: 4,
  businessUnits: [
    { name: 'opt1', value: 'opt1' },
    { name: 'opt2', value: 'opt2' },
    { name: 'opt3', value: 'opt3' },
    { name: 'opt4', value: 'opt4' },
  ],
  stores: [
    { name: 'opt1', value: 'opt1' },
    { name: 'opt2', value: 'opt2' },
    { name: 'opt3', value: 'opt3' },
    { name: 'opt4', value: 'opt4' },
  ],
  accountLinks: [
    {
      categoryId: 'dashboard',
      name: 'Dashboard',
      path: '/dashboard',
      paths: {},
      descendants: [],
    },
    {
      categoryId: 'orders',
      name: 'Orders',
      path: '/orders',
      paths: {},
      descendants: [],
    },
    {
      categoryId: 'quotes',
      name: 'Quotes',
      path: '/quotes',
      paths: {},
      descendants: [],
    },
    {
      categoryId: 'purchase-lists',
      name: 'Purchase Lists',
      path: '/purchase-lists',
      paths: {},
      descendants: [],
    },
    {
      categoryId: 'company-admin',
      name: 'Company Admin',
      path: '/company-admin',
      paths: {},
      descendants: [],
    },
    {
      categoryId: 'settings-and-security',
      name: 'Settings & Security',
      path: '/settings-and-security',
      paths: {},
      descendants: [],
    },
    {
      categoryId: 'addresses',
      name: 'Addresses',
      path: '/addresses',
      paths: {},
      descendants: [],
    },
  ],
};
