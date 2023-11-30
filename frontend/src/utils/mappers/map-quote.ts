import { Currency } from '@/types/currency';
import { Quote } from '@/types/entity/quote';
import { QuoteRequest } from '@shared/types/quote/QuoteRequest';
import { Quote as CoCoQuote } from '@shared/types/quote/Quote';
import { mapLineItem } from './map-lineitem';

export const mapQuote = (quote: CoCoQuote): Quote => {
  const currencyCode = (quote.sum?.currencyCode ?? 'USD') as Currency;
  const fractionDigits = quote.sum?.fractionDigits ?? 2;

  return {
    id: (quote.quoteId ?? '').replace(/-/g, ' '),
    status: (quote.quoteState?.toLocaleLowerCase() as Quote['status']) ?? 'inprogress',
    creationDate: quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : '-',
    businessUnit: quote.quoteRequest?.businessUnit?.name ?? quote.quoteRequest?.businessUnit?.key ?? '',
    activity: [
      {
        title: 'dashboard.quote.request.submitted',
        date: quote.createdAt && new Date(quote.createdAt).toLocaleString(undefined, { hourCycle: 'h24' }),
        author: quote.quoteRequest?.account?.firstName ?? '...',
      },
    ],
    total: (quote.sum?.centAmount ?? 0) / Math.pow(10, fractionDigits),
    subtotal:
      (quote.lineItems ?? []).reduce((acc, curr) => acc + (curr.totalPrice?.centAmount ?? 0), 0) /
      Math.pow(10, fractionDigits),
    taxCosts: (quote.tax?.amount.centAmount ?? 0) / Math.pow(10, fractionDigits),
    currency: currencyCode,
    items: (quote.lineItems ?? []).map(mapLineItem),
  };
};

export const mapQuoteRequest = (quoteRequest: QuoteRequest): Quote => {
  const currencyCode = (quoteRequest.sum?.currencyCode ?? 'USD') as Currency;
  const fractionDigits = quoteRequest.sum?.fractionDigits ?? 2;

  return {
    id: (quoteRequest.quoteRequestId ?? '').replace(/-/g, ' '),
    status: (quoteRequest.quoteRequestState?.toLocaleLowerCase() as Quote['status']) ?? 'inprogress',
    creationDate: quoteRequest.createdAt ? new Date(quoteRequest.createdAt).toLocaleDateString() : '-',
    businessUnit: quoteRequest.businessUnit?.name ?? quoteRequest.businessUnit?.key ?? '',
    activity: [],
    total: (quoteRequest.sum?.centAmount ?? 0) / Math.pow(10, fractionDigits),
    subtotal:
      (quoteRequest.lineItems ?? []).reduce((acc, curr) => acc + (curr.totalPrice?.centAmount ?? 0), 0) /
      Math.pow(10, fractionDigits),
    taxCosts: (quoteRequest.tax?.amount.centAmount ?? 0) / Math.pow(10, fractionDigits),
    currency: currencyCode,
    items: (quoteRequest.lineItems ?? []).map(mapLineItem),
  };
};
