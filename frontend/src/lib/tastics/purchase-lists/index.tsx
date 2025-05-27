'use client';

import dynamic from 'next/dynamic';
import { TasticProps } from '../types';
import { PurchaseListsProps } from './types';

const PurchaseListsClientWrapper = dynamic(() => import('./components/purchase-lists-client-wrapper'));

const PurchaseListsTastic = ({ data }: TasticProps<PurchaseListsProps>) => {
  return <PurchaseListsClientWrapper {...data} />;
};

export default PurchaseListsTastic;
