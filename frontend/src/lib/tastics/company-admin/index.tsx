'use client';

import dynamic from 'next/dynamic';

const CompanyAdminClientWrapper = dynamic(() => import('./components/company-admin-client-wrapper'));

const CompanyAdminTastic = () => {
  return <CompanyAdminClientWrapper />;
};

export default CompanyAdminTastic;
