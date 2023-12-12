'use client';

import React from 'react';
import Dashboard from '@/components/pages/dashboard';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import OrderDetailsPage from '@/components/pages/dashboard/pages/order-details';

const OrderDetailTastic = () => {
  return (
    <Dashboard href={DashboardLinks.orders}>
      <OrderDetailsPage
        order={{
          id: '2353 2245 6631',
          status: 'confirmed',
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
