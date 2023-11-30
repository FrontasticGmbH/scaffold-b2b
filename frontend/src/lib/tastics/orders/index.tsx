'use client';

import React from 'react';
import Dashboard from '@/components/pages/dashboard';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import OrdersPage from '@/components/pages/dashboard/pages/orders';
import useAccount from '@/lib/hooks/useAccount';

const OrdersTastic = () => {
  const { account } = useAccount();

  return (
    <Dashboard href={DashboardLinks.orders} userName={account?.firstName}>
      <OrdersPage
        orders={[
          {
            id: '2353 2245 6631',
            status: 'confirmed',
            creationDate: '11/03/2023',
            businessUnit: 'Greenville',
            subtotal: 5225.66,
            total: 5225.66,
            currency: 'USD',
            items: [],
          },
          {
            id: '2353 2245 6632',
            status: 'returned',
            creationDate: '11/03/2023',
            businessUnit: 'Greenville',
            subtotal: 5225.66,
            total: 5225.66,
            currency: 'USD',
            items: [],
          },
          {
            id: '2353 2245 6633',
            status: 'delivered',
            creationDate: '11/03/2023',
            businessUnit: 'Greenville',
            subtotal: 5225.66,
            total: 5225.66,
            currency: 'USD',
            items: [],
          },
          {
            id: '2353 2245 6634',
            status: 'cancelled',
            creationDate: '11/03/2023',
            businessUnit: 'Greenville',
            subtotal: 5225.66,
            total: 5225.66,
            currency: 'USD',
            items: [],
          },
          {
            id: '2353 2245 6635',
            status: 'delivered',
            creationDate: '11/03/2023',
            businessUnit: 'Greenville',
            subtotal: 5225.66,
            total: 5225.66,
            currency: 'USD',
            items: [],
          },
          {
            id: '2353 2245 6636',
            status: 'returned',
            creationDate: '11/03/2023',
            businessUnit: 'Greenville',
            subtotal: 5225.66,
            total: 5225.66,
            currency: 'USD',
            items: [],
          },
          {
            id: '2353 2245 6637',
            status: 'cancelled',
            creationDate: '11/03/2023',
            businessUnit: 'Greenville',
            subtotal: 5225.66,
            total: 5225.66,
            currency: 'USD',
            items: [],
          },
          {
            id: '2353 2245 6638',
            status: 'confirmed',
            creationDate: '11/03/2023',
            businessUnit: 'Greenville',
            subtotal: 5225.66,
            total: 5225.66,
            currency: 'USD',
            items: [],
          },
        ]}
        filters={{}}
        page={0}
        totalItems={100}
        limit={25}
        sortOptions={[
          { name: 'Date', value: 'date' },
          { name: 'Status', value: 'status' },
          { name: 'ID', value: 'id' },
          { name: 'Business Unit', value: 'businessUnit' },
          { name: 'Total', value: 'total' },
        ]}
        statusOptions={[
          { name: 'Confirmed', value: 'confirmed', count: 0 },
          { name: 'Delivered', value: 'delivered', count: 0 },
          { name: 'Cancelled', value: 'cancelled', count: 0 },
          { name: 'Returned', value: 'returned', count: 0 },
        ]}
      />
    </Dashboard>
  );
};

export default OrdersTastic;
