'use client';

import dynamic from 'next/dynamic';

const DashboardClientWrapper = dynamic(() => import('./components/dashboard-client-wrapper'));

const DashboardTastic = () => {
  return <DashboardClientWrapper />;
};

export default DashboardTastic;
