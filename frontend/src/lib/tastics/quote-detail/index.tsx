'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { DataSource } from '@/types/lib/datasources';
import { DataSourceProps } from './types';
import { TasticProps } from '../types';

const QuoteDetailClientWrapper = dynamic(() => import('./components/quote-detail-client-wrapper'));

const QuoteDetailTastic = (props: TasticProps<DataSource<DataSourceProps>>) => {
  return <QuoteDetailClientWrapper {...props} />;
};

export default QuoteDetailTastic;
