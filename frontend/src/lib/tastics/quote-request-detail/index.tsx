'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { DataSource } from '@/types/lib/datasources';
import { TasticProps } from '../types';
import { DataSourceProps } from './types';

const QuoteRequestDetailsClientWrapper = dynamic(() => import('./components/quote-request-detail-client-wrapper'));

const QuoteRequestDetailsTastic = (props: TasticProps<DataSource<DataSourceProps>>) => {
  return <QuoteRequestDetailsClientWrapper {...props} />;
};

export default QuoteRequestDetailsTastic;
