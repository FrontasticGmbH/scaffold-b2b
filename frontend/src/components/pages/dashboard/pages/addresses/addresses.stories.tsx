import { Meta, StoryFn } from '@storybook/react';
import AddressesPage from '.';

export default {
  title: 'Pages/Addresses',
  component: AddressesPage,
} as Meta<typeof AddressesPage>;

const Template: StoryFn<typeof AddressesPage> = (args) => <AddressesPage {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  accountAddresses: Array.from({ length: 3 }, (_, index) => ({
    id: index.toString(),
    name: 'commercetools',
    line1: '123 ABC Roadway',
    city: 'Chicago',
    state: 'IL',
    zip: '606 06',
    country: 'US',
    isDefaultShipping: index === 2,
    isDefaultBilling: index === 2,
  })),
};
