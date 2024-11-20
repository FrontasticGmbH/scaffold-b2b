import { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { ApprovalFlowStatus } from '@/types/entity/approval-flow';
import ApprovalFlowsPage from '.';

export default {
  title: 'Pages/Approval Flows',
  component: ApprovalFlowsPage,
} as Meta<typeof ApprovalFlowsPage>;

const Template: StoryFn<typeof ApprovalFlowsPage> = ({ approvalFlows, ...args }) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ApprovalFlowStatus>('pending');

  const filteredApprovalFlows = approvalFlows
    .filter((flow) => flow.status === status)
    .filter((flow) => (!search ? true : flow.id.replace(/\s+/g, '').includes(search.replace(/\s+/g, ''))));

  return (
    <ApprovalFlowsPage
      {...args}
      approvalFlows={filteredApprovalFlows}
      selectedStatus={status}
      onStatusSelectedChange={setStatus}
      onSearch={setSearch}
    />
  );
};

export const Primary = Template.bind({});
Primary.args = {
  businessUnitOptions: [
    { name: 'West Coast', value: '0' },
    { name: 'East Coast', value: '1' },
  ],
  approvalFlows: [
    {
      id: '2353 2245 6632',
      businessUnit: { key: 'green-ville', name: 'Greenville' },
      date: '11/03/2023',
      approvals: [],
      status: 'pending',
    },
    {
      id: '2353 2245 6633',
      businessUnit: { key: 'green-ville', name: 'Greenville' },
      date: '11/03/2023',
      approvals: [],
      status: 'pending',
    },
    {
      id: '2353 2245 6634',
      businessUnit: { key: 'green-ville', name: 'Greenville' },
      date: '11/03/2023',
      approvals: [],
      status: 'accepted',
    },
    {
      id: '2353 2245 6635',
      businessUnit: { key: '', name: 'Greenville' },
      date: '11/03/2023',
      approvals: [],
      status: 'rejected',
    },
  ],
};
