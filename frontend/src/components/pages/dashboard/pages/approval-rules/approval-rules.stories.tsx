import { Meta, StoryFn } from '@storybook/react';
import ApprovalRulesPage from '.';

export default {
  title: 'Pages/Approval Rules',
  component: ApprovalRulesPage,
} as Meta<typeof ApprovalRulesPage>;

const Template: StoryFn<typeof ApprovalRulesPage> = (args) => <ApprovalRulesPage {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  businessUnitOptions: [
    { name: 'West Coast', value: '0' },
    { name: 'East Coast', value: '1' },
  ],
  initialBusinessUnit: '0',
  roles: [
    { name: 'Buyer', value: 'Buyer' },
    { name: 'Super-user', value: 'Super-user' },
    { name: 'Admin', value: 'Admin' },
  ],
  approvalRules: [
    {
      id: '0',
      name: 'Supervisor Approval On Orders for 1200 or more',
      requesters: [{ key: 'buyer', name: 'Buyer' }],
      status: 'active',
    },
    {
      id: '1',
      name: 'Approval On Orders over 50.000',
      requesters: [{ key: 'admin  ', name: 'Admin' }],
      status: 'inactive',
    },
    {
      id: '2',
      name: 'Supervisor Approval On Orders for 2000 or more',
      requesters: [{ key: 'buyer', name: 'Buyer' }],
      status: 'active',
    },
  ],
};
