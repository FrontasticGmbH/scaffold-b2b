import { Meta, StoryFn } from '@storybook/react';
import SettingsPage from '.';

export default {
  title: 'Pages/Settings',
  component: SettingsPage,
} as Meta<typeof SettingsPage>;

const Template: StoryFn<typeof SettingsPage> = (args) => <SettingsPage {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  account: {
    firstName: 'Matt',
    lastName: 'Dickerson',
    email: 'Matt@commercetools.com',
    businessUnit: '2',
    role: 'Buyer',
  },
  businessUnitOptions: [
    { name: 'West Coast', value: '0' },
    { name: 'East Coast', value: '1' },
    { name: 'Green Ville', value: '2' },
  ],
  roleOptions: [
    { name: 'Buyer', value: 'Buyer' },
    { name: 'Super-user', value: 'Super-user' },
    { name: 'Admin', value: 'Admin' },
  ],
  isAdmin: false,
};
