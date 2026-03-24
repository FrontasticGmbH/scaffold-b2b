import { useCallback } from 'react';
import { sdk } from '@/sdk';
import useSWR from 'swr';
import { QuoteRequest } from '@shared/types/quote/QuoteRequest';
import { Quote, QuoteState } from '@shared/types/quote/Quote';
import { PaginatedResult } from '@shared/types/result';
import { Options } from './types';

const useQuotes = ({ cursor, limit, states, ids, businessUnitKey, sortAttributes }: Options) => {
  const quotesResponse = useSWR(
    !businessUnitKey ? null : ['/action/quote/query', limit, cursor, ids, states, businessUnitKey, sortAttributes],
    () =>
      sdk.composableCommerce.quote.query({
        businessUnitKey: businessUnitKey as string,
        ...(limit ? { limit } : {}),
        ...(cursor ? { cursor } : {}),
        ...(ids ? { quoteIds: ids } : {}),
        ...(states ? { quoteStates: states as QuoteState[] } : {}),
        ...(sortAttributes ? { sortAttributes } : ''),
      }),
  );

  const quoteRequestsResponse = useSWR(
    !businessUnitKey
      ? null
      : ['/action/quote/queryQuoteRequests', limit, cursor, ids, states, businessUnitKey, sortAttributes],
    () =>
      sdk.composableCommerce.quote.queryRequests({
        businessUnitKey: businessUnitKey as string,
        ...(limit ? { limit } : {}),
        ...(cursor ? { cursor } : {}),
        ...(ids ? { quoteIds: ids } : {}),
        ...(states ? { quoteStates: states as QuoteState[] } : {}),
        ...(sortAttributes ? { sortAttributes } : ''),
      }),
  );

  const quotes = quotesResponse.data?.isError
    ? ({} as Partial<PaginatedResult<Quote>>)
    : (quotesResponse.data?.data ?? ({} as Partial<PaginatedResult<Quote>>));

  const quotesLoading = !businessUnitKey || quotesResponse.isLoading;

  const quoteRequests = quoteRequestsResponse.data?.isError
    ? ({} as Partial<PaginatedResult<QuoteRequest>>)
    : (quoteRequestsResponse.data?.data ?? ({} as Partial<PaginatedResult<QuoteRequest>>));

  const quoteRequestsLoading = !businessUnitKey || quoteRequestsResponse.isLoading;

  const cancelQuoteRequest = useCallback(
    async (id: string) => {
      if (!businessUnitKey) return;

      const res = await sdk.composableCommerce.quote.cancelQuote({ id, businessUnitKey });

      return res.isError ? {} : res.data;
    },
    [businessUnitKey],
  );

  const declineQuote = useCallback(
    async (id: string) => {
      if (!businessUnitKey) return;

      const res = await sdk.composableCommerce.quote.declineQuote({ id, businessUnitKey });

      return res.isError ? {} : res.data;
    },
    [businessUnitKey],
  );

  const renegotiateQuote = useCallback(
    async ({ id, comment }: { id: string; comment: string }) => {
      if (!businessUnitKey) return;

      const res = await sdk.composableCommerce.quote.renegotiateQuote({ comment }, { id, businessUnitKey });

      return res.isError ? {} : res.data;
    },
    [businessUnitKey],
  );

  const acceptQuote = useCallback(
    async (id: string) => {
      if (!businessUnitKey) return;

      const res = await sdk.composableCommerce.quote.acceptQuote({ id, businessUnitKey });

      return res.isError ? {} : res.data;
    },
    [businessUnitKey],
  );

  return {
    quotes,
    quotesLoading,
    quoteRequests,
    quoteRequestsLoading,
    cancelQuoteRequest,
    declineQuote,
    renegotiateQuote,
    acceptQuote,
  };
};

export default useQuotes;
