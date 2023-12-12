'use client';

import React from 'react';
import { DataSource } from '@/types/lib/datasources';
import Dashboard from '@/components/pages/dashboard';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import QuoteDetailsPage from '@/components/pages/dashboard/pages/quote-details';
import { mapQuote } from '@/utils/mappers/map-quote';
import { TasticProps } from '../types';
import { DataSourceProps } from './types';

const QuoteDetailTastic = ({ data }: TasticProps<DataSource<DataSourceProps>>) => {
  if (!data.data?.dataSource?.quote) return <></>;

  return (
    <Dashboard title="dashboard.quote.details" href={DashboardLinks.quotes}>
      <QuoteDetailsPage quote={mapQuote(data.data.dataSource.quote)} />
    </Dashboard>
  );
};

export default QuoteDetailTastic;
