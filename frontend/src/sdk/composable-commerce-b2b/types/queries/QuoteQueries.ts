import { QuoteRequestState, QuoteState } from '@shared/types/quote';

type GetQuotationCartQuery = {
  // Quote ID
  id: string;
  businessUnitKey: string;
  storeKey: string;
};

type CreateQuoteQuery = {
  businessUnitKey: string;
  storeKey: string;
};

type QuoteQueryQuery = {
  businessUnitKey: string;
  limit?: number;
  cursor?: string;
  quoteIds?: string[];
  quoteStates?: QuoteState[] | QuoteRequestState[];
  // sortAttributes?: any; // TODO find accurate type and add
  query?: string;
};

type QuoteRequestsQueryQuery = {
  businessUnitKey: string;
  limit?: number;
  cursor?: string;
  quoteIds?: string[];
  quoteStates?: QuoteState[] | QuoteRequestState[];
  // sortAttributes?: any; // TODO find accurate type and add
  query?: string;
};

type AcceptQuoteQuery = {
  businessUnitKey: string;
  id: string;
};

type DeclineQuoteQuery = {
  businessUnitKey: string;
  id: string;
};

type RenegotiateQuoteQuery = {
  businessUnitKey: string;
  id: string;
};

type CancelQuoteQuery = {
  businessUnitKey: string;
  id: string;
};

export {
  type GetQuotationCartQuery,
  type CreateQuoteQuery,
  type AcceptQuoteQuery,
  type QuoteQueryQuery,
  type QuoteRequestsQueryQuery,
  type DeclineQuoteQuery,
  type RenegotiateQuoteQuery,
  type CancelQuoteQuery,
};
