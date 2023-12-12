'use client';

import Dashboard from '@/components/pages/dashboard';
import DashboardPage from '@/components/pages/dashboard/pages/dashboard';
import { DashboardLinks } from '@/components/pages/dashboard/constants';

const DashboardTastic = () => {
  return (
    <Dashboard title="common.dashboard" href={DashboardLinks.dashboard}>
      <DashboardPage />
    </Dashboard>
  );
};

export default DashboardTastic;
