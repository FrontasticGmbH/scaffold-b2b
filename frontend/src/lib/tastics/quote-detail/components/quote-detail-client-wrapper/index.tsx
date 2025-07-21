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
import toast from '@/components/atoms/toaster/helpers/toast';

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

  const mappedQuote = mapQuote(quote, { businessUnits, account });

  return (
    <div data-testid={`quote-${quote.quoteId}`}>
      <Dashboard href={DashboardLinks.quotes} userName={account?.firstName}>
        <QuoteDetailsPage
          quote={mappedQuote}
          permissions={{
            canAccept:
              (!mappedQuote.ownedByOtherUser && permissions.AcceptMyQuotes) ||
              (mappedQuote.ownedByOtherUser && permissions.AcceptOthersQuotes),
            canDecline:
              (!mappedQuote.ownedByOtherUser && permissions.DeclineMyQuotes) ||
              (mappedQuote.ownedByOtherUser && permissions.DeclineOthersQuotes),
            canRenegotiate:
              (!mappedQuote.ownedByOtherUser && permissions.RenegotiateMyQuotes) ||
              (mappedQuote.ownedByOtherUser && permissions.RenegotiateOthersQuotes),
            canRevoke: false,
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
            const res = await acceptQuote(quote.quoteId as string);

            if (!res.isError) router.refresh();
            else toast.error(res.error.message);
          }}
          onViewOrder={async () => {
            if (quote.orderNumber) router.push(DashboardLinks.orderDetail(quote.orderNumber.replace(/\s/g, '-')));
          }}
        />
      </Dashboard>
    </div>
  );
};

export default QuoteDetailClientWrapper;
