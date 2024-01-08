'use client';

import Dashboard from '@/components/pages/dashboard';
import DashboardPage from '@/components/pages/dashboard/pages/dashboard';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import useAccount from '@/lib/hooks/useAccount';

const DashboardTastic = () => {
  const { account } = useAccount();

  return (
    <Dashboard title="common.dashboard" href={DashboardLinks.dashboard} userName={account?.firstName}>
      <DashboardPage />
    </Dashboard>
  );
};

export default DashboardTastic;
