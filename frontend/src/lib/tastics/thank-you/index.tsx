'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Order } from '@shared/types/cart';
import { DataSource } from '@/types/lib/datasources';
import { TasticProps } from '../types';

const ThankYouClientWrapper = dynamic(() => import('./components/thank-you-client-wrapper'));

const ThankYouTastic = (props: TasticProps<DataSource<{ order: Order }>>) => {
  return <ThankYouClientWrapper {...props} />;
};

export default ThankYouTastic;
