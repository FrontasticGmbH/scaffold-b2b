'use client';

import dynamic from 'next/dynamic';

const PurchaseListsClientWrapper = dynamic(() => import('./components/purchase-lists-client-wrapper'));

const PurchaseListsTastic = () => {
  return <PurchaseListsClientWrapper />;
};

export default PurchaseListsTastic;
