'use client';

import React from 'react';
import Dashboard from '@/components/pages/dashboard';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import PurchaseListsPage from '@/components/pages/dashboard/pages/purchase-lists';
import { PurchaseListsPageProps } from '@/components/pages/dashboard/pages/purchase-lists/types';
import usePurchaseLists from '@/lib/hooks/usePurchaseLists';
import { mapPurchaseList } from '@/utils/mappers/map-purchase-list';
import useAccount from '@/lib/hooks/useAccount';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import useSubPath from '../../hooks/useSubPath';

const PurchaseListsClientWrapper = () => {
  const { account } = useAccount();

  const { selectedStore } = useStoreAndBusinessUnits();

  const { purchaseLists, createPurchaseList } = usePurchaseLists(selectedStore?.key, true);

  const purchaseListProps = {
    purchaseLists: purchaseLists?.items.map(mapPurchaseList),
    onAddPurchaseList: async (purchaseList) => {
      if (!selectedStore) return;

      const res = await createPurchaseList({ ...purchaseList, store: selectedStore });

      return !!res?.wishlistId;
    },
  } as PurchaseListsPageProps;

  const { ActiveSubPath } = useSubPath(purchaseListProps);

  return (
    <Dashboard
      title={ActiveSubPath?.title ?? 'common.purchase.lists'}
      href={DashboardLinks.shoppingLists}
      userName={account?.firstName}
    >
      {ActiveSubPath?.Component ?? <PurchaseListsPage {...purchaseListProps} />}
    </Dashboard>
  );
};

export default PurchaseListsClientWrapper;
