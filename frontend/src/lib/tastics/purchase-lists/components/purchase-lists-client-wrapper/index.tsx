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
import useAccountRoles from '@/lib/hooks/useAccountRoles';
import useSubPath from '../../hooks/useSubPath';
import { PurchaseListsProps } from '../../types';

const PurchaseListsClientWrapper = (data: PurchaseListsProps) => {
  const { account } = useAccount();

  const { selectedStore } = useStoreAndBusinessUnits();

  const { purchaseLists, isLoading, createPurchaseList } = usePurchaseLists(selectedStore?.key);
  const { permissions } = useAccountRoles();

  const purchaseListsProps = {
    purchaseLists: purchaseLists?.items.map(mapPurchaseList),
    loading: isLoading,
    onAddPurchaseList: async (purchaseList) => {
      if (!selectedStore) return;

      const res = await createPurchaseList({ ...purchaseList, store: selectedStore });

      return !!res?.wishlistId;
    },
    image: data.image,
    permissionImage: data.permissionImage,
    permissions,
  } as PurchaseListsPageProps;

  const { ActiveSubPath } = useSubPath(purchaseListsProps);

  return (
    <Dashboard
      title={ActiveSubPath?.title ?? 'common.purchase-lists'}
      href={DashboardLinks.shoppingLists}
      userName={account?.firstName}
    >
      {ActiveSubPath?.Component ?? <PurchaseListsPage {...purchaseListsProps} />}
    </Dashboard>
  );
};

export default PurchaseListsClientWrapper;
