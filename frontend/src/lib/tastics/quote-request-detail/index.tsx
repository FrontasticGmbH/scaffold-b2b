'use client';

import React from 'react';
import { DataSource } from '@/types/lib/datasources';
import Dashboard from '@/components/pages/dashboard';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import QuoteDetailsPage from '@/components/pages/dashboard/pages/quote-details';
import { mapQuoteRequest } from '@/utils/mappers/map-quote';
import useAccount from '@/lib/hooks/useAccount';
import { TasticProps } from '../types';
import { DataSourceProps } from './types';

const QuoteRequestDetailsTastic = ({ data }: TasticProps<DataSource<DataSourceProps>>) => {
  const { account } = useAccount();

  if (!data.data?.dataSource?.quoteRequest) return <></>;

  return (
    <Dashboard href={DashboardLinks.quotes} userName={account?.firstName}>
      <QuoteDetailsPage quote={mapQuoteRequest(data.data.dataSource.quoteRequest)} />
    </Dashboard>
  );
};

export default QuoteRequestDetailsTastic;
