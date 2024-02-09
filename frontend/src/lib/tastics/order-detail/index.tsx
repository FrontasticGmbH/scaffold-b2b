'use client';
import React from 'react';
import { DataSource } from '@/types/lib/datasources';
import Dashboard from '@/components/pages/dashboard';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import OrderDetailsPage from '@/components/pages/dashboard/pages/order-details';
import useAccount from '@/lib/hooks/useAccount';
import { mapOrder } from '@/utils/mappers/map-order';
import useOrders from '@/lib/hooks/useOrders';
import useCustomRouter from '@/hooks/useCustomRouter';
import { TasticProps } from '../types';
import { DataSourceProps } from './types';

const OrderDetailTastic = ({ data }: TasticProps<DataSource<DataSourceProps>>) => {
  const router = useCustomRouter();

  const { account } = useAccount();

  const order = data.data?.dataSource?.order;

  const { cancelOrder, replicateOrder } = useOrders({});

  if (!order) return <></>;

  return (
    <Dashboard href={DashboardLinks.orders} userName={account?.firstName}>
      <OrderDetailsPage
        order={mapOrder(order)}
        onReturn={async () => {
          const res = await cancelOrder(order);
          router.refresh();
          return !!res.orderId;
        }}
        onReorder={async () => {
          const res = await replicateOrder(order.orderId as string);

          const success = !!res.orderId;

          if (success) router.push(`/thank-you?orderId=${res.orderId}`);

          return !!res.orderId;
        }}
      />
    </Dashboard>
  );
};

export default OrderDetailTastic;
