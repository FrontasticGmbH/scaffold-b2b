'use client';

import React from 'react';
import { DataSource } from '@/types/lib/datasources';
import Dashboard from '@/components/pages/dashboard';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import QuoteDetailsPage from '@/components/pages/dashboard/pages/quote-details';
import { mapQuoteRequest } from '@/utils/mappers/map-quote';
import useAccount from '@/lib/hooks/useAccount';
import useQuotes from '@/lib/hooks/useQuotes';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import useCustomRouter from '@/hooks/useCustomRouter';
import useAccountRoles from '@/lib/hooks/useAccountRoles';
import { TasticProps } from '@/lib/tastics/types';
import useBusinessUnits from '@/lib/hooks/useBusinessUnits';
import { DataSourceProps } from '../../types';

const QuoteRequestDetailsClientWrapper = ({ data }: TasticProps<DataSource<DataSourceProps>>) => {
  const router = useCustomRouter();

  const { account } = useAccount();

  const { businessUnits } = useBusinessUnits();

  const { selectedBusinessUnit } = useStoreAndBusinessUnits();

  const { permissions } = useAccountRoles(selectedBusinessUnit?.key);

  const { cancelQuoteRequest } = useQuotes({ businessUnitKey: selectedBusinessUnit?.key ?? '' });

  const quoteRequest = data.data?.dataSource?.quoteRequest;

  if (!quoteRequest) return <></>;

  const mappedQuoteRequest = mapQuoteRequest(quoteRequest, { businessUnits, account });

  return (
    <div data-testid={`quote_request-${quoteRequest.quoteRequestId}`}>
      <Dashboard href={DashboardLinks.quotes} userName={account?.firstName}>
        <QuoteDetailsPage
          quote={mappedQuoteRequest}
          permissions={{
            canAccept:
              (!mappedQuoteRequest.ownedByOtherUser && permissions.AcceptMyQuotes) ||
              (mappedQuoteRequest.ownedByOtherUser && permissions.AcceptOthersQuotes),
            canDecline:
              (!mappedQuoteRequest.ownedByOtherUser && permissions.DeclineMyQuotes) ||
              (mappedQuoteRequest.ownedByOtherUser && permissions.DeclineOthersQuotes),
            canRenegotiate:
              (!mappedQuoteRequest.ownedByOtherUser && permissions.RenegotiateMyQuotes) ||
              (mappedQuoteRequest.ownedByOtherUser && permissions.RenegotiateOthersQuotes),
            canRevoke:
              (!mappedQuoteRequest.ownedByOtherUser && permissions.UpdateMyQuoteRequests) ||
              (mappedQuoteRequest.ownedByOtherUser && permissions.UpdateOthersQuoteRequests),
          }}
          isQuoteRequest
          onRevoke={async () => {
            await cancelQuoteRequest(quoteRequest.quoteRequestId as string);
            router.refresh();
          }}
        />
      </Dashboard>
    </div>
  );
};

export default QuoteRequestDetailsClientWrapper;
