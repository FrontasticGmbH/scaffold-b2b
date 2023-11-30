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
  quotas: '4',
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
  myAccount: {
    categoryId: 'my-account',
    name: 'My Account',
    path: '/dashboard',
    subCategories: [
      {
        categoryId: 'dashboard',
        name: 'Dashboard',
        path: '/dashboard',
        subCategories: [],
      },
      {
        categoryId: 'orders',
        name: 'Orders',
        path: '/orders',
        subCategories: [],
      },
      {
        categoryId: 'quotes',
        name: 'Quotes',
        path: '/quotes',
        subCategories: [],
      },
      {
        categoryId: 'purchase-lists',
        name: 'Purchase Lists',
        path: '/purchase-lists',
        subCategories: [],
      },
      {
        categoryId: 'company-admin',
        name: 'Company Admin',
        path: '/company-admin',
        subCategories: [],
      },
      {
        categoryId: 'settings-and-security',
        name: 'Settings & Security',
        path: '/settings-and-security',
        subCategories: [],
      },
      {
        categoryId: 'addresses',
        name: 'Addresses',
        path: '/addresses',
        subCategories: [],
      },
    ],
  },
};
