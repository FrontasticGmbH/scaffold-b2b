'use client';

import dynamic from 'next/dynamic';
import { DataSource } from '@/types/lib/datasources';
import { TasticProps } from '../types';
import { DataSourceProps, PurchaseListDetailProps } from './types';

const PurchaseListDetailClientWrapper = dynamic(() => import('./components/purchase-list-detail-client-wrapper'));

const PurchaseListDetailTastic = (props: TasticProps<DataSource<DataSourceProps> & PurchaseListDetailProps>) => {
  return <PurchaseListDetailClientWrapper {...props} />;
};

export default PurchaseListDetailTastic;
