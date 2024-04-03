'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { DataSource } from '@/types/lib/datasources';
import { TasticProps } from '../types';
import { DataSourceProps } from './types';

const OrderDetailClientWrapper = dynamic(() => import('./components/order-detail-client-wrapper'));

const OrderDetailTastic = (props: TasticProps<DataSource<DataSourceProps>>) => {
  return <OrderDetailClientWrapper {...props} />;
};

export default OrderDetailTastic;
