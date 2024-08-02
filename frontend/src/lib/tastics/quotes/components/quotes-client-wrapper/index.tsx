'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Dashboard from '@/components/pages/dashboard';
import QuotesPage from '@/components/pages/dashboard/pages/quotes';
import useQuotes from '@/lib/hooks/useQuotes';
import { mapQuote, mapQuoteRequest } from '@/utils/mappers/map-quote';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import useAccount from '@/lib/hooks/useAccount';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import useBusinessUnits from '@/lib/hooks/useBusinessUnits';
import useRefinements from '../../hooks/useRefinements';
import useStatusesOptions from '../../hooks/useStatusesOptions';

const QuotesClientWrapper = () => {
  const router = useRouter();

  const { account } = useAccount();

  const { selectedBusinessUnit } = useStoreAndBusinessUnits();

  const { businessUnits } = useBusinessUnits();

  const searchParams = useSearchParams();

  const defaultSelected = (searchParams.get('selected') ?? 'quotes') as 'quotes' | 'quotes.requests';

  const [selected, setSelected] = useState(defaultSelected);

  const quoteRefinements = useRefinements();
  const quoteRequestsRefinements = useRefinements();

  const {
    page,
    limit,
    setLimit,
    cursor,
    setCursor,
    clearRefinements,
    states,
    addState,
    removeState,
    search,
    debouncedSearch,
    setSearch,
  } = selected === 'quotes' ? quoteRefinements : quoteRequestsRefinements;

  const { quotes, quoteRequests } = useQuotes({
    businessUnitKey: selectedBusinessUnit?.key ?? '',
    limit,
    cursor,
    sortAttributes: [{ createdAt: 'desc' }],
    ...(states.length ? { states } : {}),
    ...(debouncedSearch ? { ids: [debouncedSearch] } : {}),
  });

  const quotesRes = selected === 'quotes' ? quotes : quoteRequests;

  const previousCursor = quotesRes.previousCursor;
  const nextCursor = quotesRes.nextCursor;
  const total = quotesRes.total ?? 0;

  const { quoteStatusOptions, quoteRequestStatusOptions } = useStatusesOptions();

  const statusOptions = selected === 'quotes' ? quoteStatusOptions : quoteRequestStatusOptions;

  return (
    <Dashboard href={DashboardLinks.quotes} userName={account?.firstName}>
      <QuotesPage
        onSelectedChange={(newSelected) => {
          setSelected(newSelected);
          router.replace(`?selected=${newSelected}`);
        }}
        filters={{ search, status: states }}
        sortOptions={[]}
        statusOptions={statusOptions}
        onSearch={(val) => setSearch(val)}
        onStatusRefine={(status) => {
          const isRefined = states.includes(status);

          if (!isRefined) addState(status);
          else removeState(status);
        }}
        onClearRefinements={clearRefinements}
        quotes={(quotesRes?.items ?? [])
          .map((item) =>
            selected === 'quotes' ? mapQuote(item, { businessUnits }) : mapQuoteRequest(item, { businessUnits }),
          )
          .map((quote) => ({
            ...quote,
            url: (selected === 'quotes' ? DashboardLinks.quoteDetail : DashboardLinks.quoteRequestDetail)(quote.id),
          }))}
        page={page}
        totalItems={total}
        limit={limit}
        onPageChange={(newPage) => {
          const isNext = newPage > page;

          if (isNext && nextCursor) setCursor(nextCursor);
          else if (!isNext && previousCursor) setCursor(previousCursor);
        }}
        onRowsPerPageChange={(newLimit) => setLimit(+newLimit)}
      />
    </Dashboard>
  );
};

export default QuotesClientWrapper;
