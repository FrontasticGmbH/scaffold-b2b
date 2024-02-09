import { useCallback } from 'react';
import { sdk } from '@/sdk';
import useSWR, { useSWRConfig } from 'swr';
import { Result } from '@shared/types/quote/Result';
import { QuoteRequest } from '@shared/types/quote/QuoteRequest';
import { Quote, QuoteState } from '@shared/types/quote/Quote';
import { Cart } from '@shared/types/cart';
import { Options } from './types';

const useQuotes = ({ cursor, limit, states, ids, businessUnitKey, storeKey }: Options) => {
  const { mutate: globalMutate } = useSWRConfig();

  const quotesResponse = useSWR(['/action/quote/query', limit, cursor, ids, states, businessUnitKey], () =>
    sdk.composableCommerce.quote.query({
      businessUnitKey,
      ...(limit ? { limit } : {}),
      ...(cursor ? { cursor } : {}),
      ...(ids ? { quoteIds: ids } : {}),
      ...(states ? { quoteStates: states as QuoteState[] } : {}),
    }),
  );

  const quoteRequestsResponse = useSWR(
    ['/action/quote/queryQuoteRequests', limit, cursor, ids, states, businessUnitKey],
    () =>
      sdk.composableCommerce.quote.queryRequests({
        businessUnitKey,
        ...(limit ? { limit } : {}),
        ...(cursor ? { cursor } : {}),
        ...(ids ? { quoteIds: ids } : {}),
        ...(states ? { quoteStates: states as QuoteState[] } : {}),
      }),
  );

  const quotes = quotesResponse.data?.isError
    ? ({} as Partial<Result & { items: Quote[] }>)
    : quotesResponse.data?.data ?? ({} as Partial<Result & { items: Quote[] }>);

  const quoteRequests = quoteRequestsResponse.data?.isError
    ? ({} as Partial<Result & { items: QuoteRequest[] }>)
    : quoteRequestsResponse.data?.data ?? ({} as Partial<Result & { items: QuoteRequest[] }>);

  const cancelQuoteRequest = useCallback(
    async (id: string) => {
      const res = await sdk.composableCommerce.quote.cancelQuote({ id, businessUnitKey });

      return res.isError ? {} : res.data;
    },
    [businessUnitKey],
  );

  const declineQuote = useCallback(
    async (id: string) => {
      const res = await sdk.composableCommerce.quote.declineQuote({ id, businessUnitKey });

      return res.isError ? {} : res.data;
    },
    [businessUnitKey],
  );

  const renegotiateQuote = useCallback(
    async ({ id, comment }: { id: string; comment: string }) => {
      const res = await sdk.composableCommerce.quote.renegotiateQuote({ comment }, { id, businessUnitKey });

      return res.isError ? {} : res.data;
    },
    [businessUnitKey],
  );

  const acceptQuote = useCallback(
    async (id: string) => {
      const res = await sdk.composableCommerce.quote.acceptQuote({ id, businessUnitKey });

      return res.isError ? {} : res.data;
    },
    [businessUnitKey],
  );

  const getQuotationCart = useCallback(
    async (id: string) => {
      const res = await sdk.callAction<Cart>({
        actionName: 'quote/getQuotationCart',
        query: { id, businessUnitKey, storeKey: storeKey ?? '' },
      });

      globalMutate(['/action/cart/getCart', businessUnitKey, storeKey]);
      return res.isError ? { isSuccess: false, message: res.error } : { isSuccess: true, ...res.data };
    },
    [businessUnitKey, storeKey, globalMutate],
  );

  return { quotes, quoteRequests, cancelQuoteRequest, declineQuote, renegotiateQuote, acceptQuote, getQuotationCart };
};

export default useQuotes;
