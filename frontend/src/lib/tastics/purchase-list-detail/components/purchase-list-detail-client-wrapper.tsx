'use client';

import React from 'react';
import { DataSource } from '@/types/lib/datasources';
import { SWRConfig, unstable_serialize } from 'swr';
import { DataSourceProps } from '../types';
import PurchaseListDetailViewModel from '../components/purchase-list-detail-view-model';
import { TasticProps } from '../../types';

const PurchaseListDetailClientWrapper = ({ data }: TasticProps<DataSource<DataSourceProps>>) => {
  const wishlist = data?.data?.dataSource?.wishlist.items[0];

  if (!wishlist) return;

  return (
    <SWRConfig
      value={{
        fallback: {
          [unstable_serialize(['/action/wishlist/getWishlist', wishlist.wishlistId])]: {
            isError: false,
            data: { items: [wishlist] },
          },
        },
      }}
    >
      <PurchaseListDetailViewModel wishlistId={wishlist.wishlistId as string} />
    </SWRConfig>
  );
};

export default PurchaseListDetailClientWrapper;
