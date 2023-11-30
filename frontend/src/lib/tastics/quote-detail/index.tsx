'use client';

import React from 'react';
import { DataSource } from '@/types/lib/datasources';
import Dashboard from '@/components/pages/dashboard';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import QuoteDetailsPage from '@/components/pages/dashboard/pages/quote-details';
import { mapQuote } from '@/utils/mappers/map-quote';
import useAccount from '@/lib/hooks/useAccount';
import { TasticProps } from '../types';
import { DataSourceProps } from './types';

const QuoteDetailTastic = ({ data }: TasticProps<DataSource<DataSourceProps>>) => {
  const { account } = useAccount();

  if (!data.data?.dataSource?.quote) return <></>;

  return (
    <Dashboard href={DashboardLinks.quotes} userName={account?.firstName}>
      <QuoteDetailsPage quote={mapQuote(data.data.dataSource.quote)} />
    </Dashboard>
  );
};

export default QuoteDetailTastic;
