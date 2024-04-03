'use client';

import dynamic from 'next/dynamic';

const OrdersClientWrapper = dynamic(() => import('./components/orders-client-wrapper'));

const OrdersTastic = () => {
  return <OrdersClientWrapper />;
};

export default OrdersTastic;
