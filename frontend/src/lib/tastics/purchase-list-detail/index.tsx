'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DataSource } from '@/types/lib/datasources';
import PurchaseListDetailPage from '@/components/pages/dashboard/pages/purchase-list-detail';
import Dashboard from '@/components/pages/dashboard';
import { mapPurchaseList } from '@/utils/mappers/map-purchase-list';
import usePurchaseLists from '@/lib/hooks/usePurchaseLists';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import { TasticProps } from '../types';
import { DataSourceProps } from './types';

const PurchaseListDetailTastic = ({ data }: TasticProps<DataSource<DataSourceProps>>) => {
  const router = useRouter();

  const { updateWishlist } = usePurchaseLists();

  if (!data.data?.dataSource?.wishlist) return;

  return (
    <Dashboard href={DashboardLinks.shoppingLists}>
      <PurchaseListDetailPage
        purchaseList={mapPurchaseList(data.data.dataSource.wishlist)}
        onUpdatePurchaseList={async ({ id, name, description }) => {
          await updateWishlist({ wishlistId: id, name, description });
          router.refresh();
        }}
      />
    </Dashboard>
  );
};

export default PurchaseListDetailTastic;
