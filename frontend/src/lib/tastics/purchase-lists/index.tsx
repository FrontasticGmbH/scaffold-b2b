'use client';

import React from 'react';
import Dashboard from '@/components/pages/dashboard';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import PurchaseListsPage from '@/components/pages/dashboard/pages/purchase-lists';
import { PurchaseListsPageProps } from '@/components/pages/dashboard/pages/purchase-lists/types';
import usePurchaseLists from '@/lib/hooks/usePurchaseLists';
import useStores from '@/lib/hooks/useStores';
import { mapPurchaseList } from '@/utils/mappers/map-purchase-list';
import useSubPath from './hooks/useSubPath';

const PurchaseListsTastic = () => {
  const { purchaseLists, createPurchaseList } = usePurchaseLists();

  const { defaultStore } = useStores();

  const purchaseListProps = {
    purchaseLists: purchaseLists.map(mapPurchaseList),
    onAddPurchaseList: async (purchaseList) => {
      if (!defaultStore) return;

      await createPurchaseList({ ...purchaseList, store: defaultStore });
    },
  } as PurchaseListsPageProps;

  const { ActiveSubPath } = useSubPath(purchaseListProps);

  return (
    <Dashboard title={ActiveSubPath?.title ?? 'common.purchase.lists'} href={DashboardLinks.shoppingLists}>
      {ActiveSubPath?.Component ?? <PurchaseListsPage {...purchaseListProps} />}
    </Dashboard>
  );
};

export default PurchaseListsTastic;
