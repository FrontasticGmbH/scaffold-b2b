'use client';

import React from 'react';
import { DataSource } from '@/types/lib/datasources';
import Dashboard from '@/components/pages/dashboard';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import QuoteDetailsPage from '@/components/pages/dashboard/pages/quote-details';
import { mapQuote } from '@/utils/mappers/map-quote';
import useQuotes from '@/lib/hooks/useQuotes';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import useCustomRouter from '@/hooks/useCustomRouter';
import useAccount from '@/lib/hooks/useAccount';
import useAccountRoles from '@/lib/hooks/useAccountRoles';
import { TasticProps } from '@/lib/tastics/types';
import useBusinessUnits from '@/lib/hooks/useBusinessUnits';
import { DataSourceProps } from '../../types';

const QuoteDetailClientWrapper = ({ data }: TasticProps<DataSource<DataSourceProps>>) => {
  const router = useCustomRouter();

  const { account } = useAccount();

  const { businessUnits } = useBusinessUnits();

  const { selectedBusinessUnit, selectedStore } = useStoreAndBusinessUnits();

  const { permissions } = useAccountRoles(selectedBusinessUnit?.key);

  const { declineQuote, renegotiateQuote, acceptQuote } = useQuotes({
    businessUnitKey: selectedBusinessUnit?.key ?? '',
    storeKey: selectedStore?.key ?? '',
  });

  const quote = data.data?.dataSource?.quote;

  if (!quote) return <></>;

  return (
    <Dashboard href={DashboardLinks.quotes} userName={account?.firstName}>
      <QuoteDetailsPage
        quote={mapQuote(quote, { businessUnits })}
        permissions={{
          canAccept: permissions.AcceptMyQuotes,
          canDecline: permissions.DeclineMyQuotes,
          canRenegotiate: permissions.RenegotiateMyQuotes,
          canRevoke: permissions.UpdateMyQuoteRequests,
        }}
        onReject={async () => {
          await declineQuote(quote.quoteId as string);
          router.refresh();
        }}
        onRenegotiate={async (comment: string) => {
          await renegotiateQuote({ id: quote.quoteId as string, comment });
          router.refresh();
        }}
        onAccept={async () => {
          await acceptQuote(quote.quoteId as string);
          router.refresh();
        }}
        onViewOrder={async () => {
          if (quote.orderNumber) router.push(DashboardLinks.orderDetail(quote.orderNumber.replace(/\s/g, '-')));
        }}
      />
    </Dashboard>
  );
};

export default QuoteDetailClientWrapper;
