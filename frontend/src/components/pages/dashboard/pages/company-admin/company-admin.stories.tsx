import { Meta, StoryFn } from '@storybook/react';
import countries from '@/static/countries.json';
import CompanyAdminPage from '.';

export default {
  title: 'Pages/Company Admin',
  component: CompanyAdminPage,
} as Meta<typeof CompanyAdminPage>;

const Template: StoryFn<typeof CompanyAdminPage> = (args) => <CompanyAdminPage {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  companyName: 'commercetools',
  businessUnitOptions: [
    { name: 'West Coast', value: '0' },
    { name: 'East Coast', value: '1' },
  ],
  initialBusinessUnit: '0',
  countryOptions: countries.map(({ name, code, states }) => ({
    name,
    value: code,
    states: (states ?? []).map(({ name, code }) => ({ name, value: code })),
  })),
  roleOptions: [
    { name: 'Buyer', value: 'Buyer' },
    { name: 'Super-user', value: 'Super-user' },
    { name: 'Admin', value: 'Admin' },
  ],
  generalInformation: [
    {
      id: '0',
      key: 'commercetools',
      name: 'commercetools',
      email: '123@commercetools.com',
      addresses: [],
    },
  ],
  addresses: Array.from({ length: 3 }, (_, index) => ({
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
  associates: [
    {
      id: '0',
      firstName: 'Matt',
      lastName: 'Dickerson',
      email: '123@commercetools.com',
      roles: ['Buyer'],
      status: 'confirmed',
    },
    {
      id: '1',
      firstName: 'Trixie',
      lastName: 'Byrd',
      email: '123@commercetools.com',
      roles: ['Super-user'],
      status: 'confirmed',
    },
    {
      id: '1',
      firstName: 'Viktor',
      lastName: 'Byrd',
      email: '123@commercetools.com',
      roles: ['Admin'],
      status: 'pending',
    },
  ],
  businessUnits: Array.from({ length: 3 }, (_, index) => ({
    id: index.toString(),
    name: `commercetools ${index + 1}`,
    key: `ct-region-${index + 1}`,
    email: '123@commercetools.com',
    addresses: [],
  })),
};
