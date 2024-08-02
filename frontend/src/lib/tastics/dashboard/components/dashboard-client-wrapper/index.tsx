'use client';

import Dashboard from '@/components/pages/dashboard';
import DashboardPage from '@/components/pages/dashboard/pages/dashboard';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import useAccount from '@/lib/hooks/useAccount';
import useOrders from '@/lib/hooks/useOrders';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import { mapOrder } from '@/utils/mappers/map-order';
import useBusinessUnits from '@/lib/hooks/useBusinessUnits';
import useApprovalFlows from '@/lib/hooks/useApprovalFlows';

const DashboardClientWrapper = () => {
  const { account } = useAccount();

  const { businessUnits } = useBusinessUnits();

  const { selectedBusinessUnit } = useStoreAndBusinessUnits();

  const { approvalFlows } = useApprovalFlows({
    businessUnitKey: selectedBusinessUnit?.key,
    filters: { status: 'Pending' },
  });

  const { orders } = useOrders({
    limit: 5,
    businessUnitKey: selectedBusinessUnit?.key,
    sortAttributes: [{ createdAt: 'desc' }],
  });

  return (
    <Dashboard href={DashboardLinks.dashboard} userName={account?.firstName}>
      <DashboardPage
        orders={(orders.items ?? []).map((order) => mapOrder(order, { businessUnits }))}
        hasPendingApprovalFlows={approvalFlows.length > 0}
      />
    </Dashboard>
  );
};

export default DashboardClientWrapper;
