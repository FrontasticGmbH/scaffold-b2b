'use client';

import dynamic from 'next/dynamic';
import { DataSource } from '@/types/lib/datasources';
import { TasticProps } from '../types';
import { DataSourceProps } from './types';

const PurchaseListDetailClientWrapper = dynamic(() => import('./components/purchase-list-detail-client-wrapper'));

const PurchaseListDetailTastic = (props: TasticProps<DataSource<DataSourceProps>>) => {
  return <PurchaseListDetailClientWrapper {...props} />;
};

export default PurchaseListDetailTastic;
