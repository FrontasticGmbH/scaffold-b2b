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
import useCart from '@/lib/hooks/useCart';
import { TasticProps } from '../types';
import { DataSourceProps } from './types';

const PurchaseListDetailTastic = ({ data }: TasticProps<DataSource<DataSourceProps>>) => {
  const router = useRouter();

  const { account } = useAccount();

  const { selectedBusinessUnit, selectedStore } = useStoreAndBusinessUnits();

  const { addItem: addItemToCart } = useCart(selectedBusinessUnit?.key, selectedStore?.key);

  const { updatePurchaseList, deletePurchaseList, removeItem, updateItem } = usePurchaseLists(selectedStore?.key);

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
        onUpdateItem={async (item) => {
          if (!item.sku || !item.id) return false;
          const res = await updateItem({
            wishlistId: wishlist.wishlistId,
            lineItemId: item.id,
            count: item.quantity ?? 1,
          });
          router.refresh();
          return !!res;
        }}
        onAddItemToCart={async (item) => {
          if (!item.sku) return false;
          const res = await addItemToCart([{ sku: item.sku, count: item.quantity ?? 1 }]);
          router.refresh();
          return !!res;
        }}
      />
    </Dashboard>
  );
};

export default PurchaseListDetailTastic;
