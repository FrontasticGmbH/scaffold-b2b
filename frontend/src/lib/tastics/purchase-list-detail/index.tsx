'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DataSource } from '@/types/lib/datasources';
import PurchaseListDetailPage from '@/components/pages/dashboard/pages/purchase-list-detail';
import Dashboard from '@/components/pages/dashboard';
import { mapPurchaseList } from '@/utils/mappers/map-purchase-list';
import usePurchaseLists from '@/lib/hooks/usePurchaseLists';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import useAccount from '@/lib/hooks/useAccount';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import { TasticProps } from '../types';
import { DataSourceProps } from './types';

const PurchaseListDetailTastic = ({ data }: TasticProps<DataSource<DataSourceProps>>) => {
  const router = useRouter();

  const { account } = useAccount();

  const { selectedStore } = useStoreAndBusinessUnits();

  const { updatePurchaseList, deletePurchaseList, removeItem } = usePurchaseLists(selectedStore?.key);

  const wishlist = data?.data?.dataSource?.wishlist.items[0];

  if (!wishlist) return;

  return (
    <Dashboard href={DashboardLinks.shoppingLists} userName={account?.firstName}>
      <PurchaseListDetailPage
        purchaseList={mapPurchaseList(wishlist)}
        onUpdatePurchaseList={async ({ id, name, description }) => {
          const res = await updatePurchaseList({ wishlistId: id, name, description });
          router.refresh();
          return !!res?.wishlistId;
        }}
        onDeletePurchaseList={async () => {
          await deletePurchaseList({ wishlistId: wishlist.wishlistId, store: wishlist.store });
          router.back();
          return true;
        }}
        onRemoveItem={async (id) => {
          const res = await removeItem({ wishlistId: wishlist.wishlistId, store: wishlist.store, lineItemId: id });
          router.refresh();
          return !!res?.wishlistId;
        }}
      />
    </Dashboard>
  );
};

export default PurchaseListDetailTastic;
