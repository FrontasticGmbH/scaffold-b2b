'use client';
import React from 'react';
import { DataSource } from '@/types/lib/datasources';
import Dashboard from '@/components/pages/dashboard';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import OrderDetailsPage from '@/components/pages/dashboard/pages/order-details';
import useAccount from '@/lib/hooks/useAccount';
import { TasticProps } from '../types';
import { DataSourceProps } from './types';

const OrderDetailTastic = ({ data }: TasticProps<DataSource<DataSourceProps>>) => {
  const { account } = useAccount();
  if (!data.data?.dataSource?.order) return <div>Im an Order Detail</div>;

  return (
    <Dashboard href={DashboardLinks.orders} userName={account?.firstName}>
      <OrderDetailsPage
        order={{
          id: '2353 2245 6631',
          status: 'Confirmed',
          creationDate: '11/03/2023',
          businessUnit: 'Greenville',
          subtotal: 5225.66,
          total: 5225.66,
          currency: 'USD',
          items: [],
        }}
      />
    </Dashboard>
  );
};

export default OrderDetailTastic;
