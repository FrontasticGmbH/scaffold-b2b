import { Currency } from '@/types/currency';
import { Quote } from '@/types/entity/quote';
import { QuoteRequest } from '@shared/types/quote/QuoteRequest';
import { Quote as CoCoQuote } from '@shared/types/quote/Quote';
import { calculateTransaction } from '@/lib/utils/calculate-transaction';
import { mapLineItem } from './map-lineitem';

const getQuoteActivity = (quote: CoCoQuote | QuoteRequest, status: Quote['status']) => {
  const activity = [] as Quote['activity'];

  if (status === 'submitted') {
    activity.push({
      title: 'dashboard.awaiting.reply.from.seller',
      revoke: true,
    });
  }

  if (status === 'cancelled') {
    activity.push({ title: 'dashboard.quote.cancelled' });
  }

  if (status === 'rejected') {
    activity.push({ title: 'dashboard.quote.rejected.by.seller' });
  }

  if (status === 'inprogress') {
    activity.push({
      title: 'dashboard.quote.accepted.by.seller',
      comment: '',
      commentBy: 'seller',
    });

    if ((quote as CoCoQuote).quoteRequest) {
      if (quote.expirationDate) {
        activity.push({
          title: 'dashboard.reply.needed.before',
          titleValues: {
            date: new Date(quote.expirationDate).toLocaleDateString().replace(/\//g, '-'),
          },
          renegotiate: true,
          reply: true,
        });
      } else {
        activity.push({
          title: 'dashboard.reply.needed',
          renegotiate: true,
          reply: true,
        });
      }
    }
  }

  if (status === 'declined') {
    activity.push(
      {
        title: 'dashboard.quote.accepted.by.seller',
        comment: '',
        commentBy: 'seller',
      },
      {
        title: 'dashboard.quote.declined',
      },
    );
  }

  if (status === 'waiting') {
    activity.push(
      {
        title: 'dashboard.quote.accepted.by.seller',
        comment: '',
        commentBy: 'seller',
      },
      {
        title: 'dashboard.quote.renegotiated',
        comment: quote.buyerComment ?? '',
        commentBy: 'author',
      },
      {
        title: 'dashboard.awaiting.reply.from.seller',
      },
    );
  }

  if (status === 'renegotiating') {
    activity.push(
      {
        title: 'dashboard.quote.accepted.by.seller',
        comment: '',
        commentBy: 'seller',
      },
      {
        title: 'dashboard.quote.renegotiated',
        comment: quote.buyerComment ?? '',
        commentBy: 'author',
      },
      {
        title: 'dashboard.quote.accepted.by.seller',
        comment: '',
        commentBy: 'seller',
      },
    );

    if (quote.expirationDate) {
      activity.push({
        title: 'dashboard.reply.needed.before',
        titleValues: {
          date: new Date(quote.expirationDate).toLocaleDateString().replace(/\//g, '-'),
        },
        reply: true,
      });
    } else {
      activity.push({
        title: 'dashboard.reply.needed',
        reply: true,
      });
    }
  }

  if (status === 'accepted') {
    if ((quote as CoCoQuote).quoteRequest) {
      activity.push({
        title: 'dashboard.quote.accepted.by.seller',
        comment: '',
        commentBy: 'seller',
      });

      if (quote.buyerComment) {
        activity.push(
          {
            title: 'dashboard.quote.renegotiated',
            comment: quote.buyerComment ?? '',
            commentBy: 'author',
          },
          {
            title: 'dashboard.quote.accepted.by.seller',
            comment: '',
            commentBy: 'seller',
          },
        );
      }

      activity.push({
        title: 'dashboard.quote.accepted.by.buyer',
      });

      if ((quote as CoCoQuote).orderNumber) {
        activity.push({
          title: 'dashboard.quote.order.was.created',
          titleValues: { number: ((quote as CoCoQuote).orderNumber ?? '').replace(/-/g, ' ') },
          viewOrder: true,
        });
      } else {
        activity.push({
          title: 'dashboard.finalize.quote.order',
          checkout: true,
        });
      }
    } else {
      activity.push({ title: 'dashboard.quote.accepted.by.seller' });
    }
  }

  return activity;
};

const getQuoteTransaction = (
  quote: CoCoQuote,
): Pick<Quote, 'total' | 'subtotal' | 'shippingCosts' | 'taxCosts' | 'currency'> => {
  const { total, shipping, subtotal, tax, discount } = calculateTransaction(quote);

  const currencyCode = (quote.sum?.currencyCode ?? 'USD') as Currency;

  return {
    currency: currencyCode,
    subtotal: subtotal.centAmount,
    ...(subtotal.centAmount > 0 ? { taxCosts: tax.centAmount } : {}),
    ...(shipping.centAmount > 0 ? { shippingCosts: shipping.centAmount } : {}),
    ...(discount.centAmount > 0 ? { discount: discount.centAmount } : {}),
    total: total.centAmount,
  };
};

export const mapQuote = (quote: CoCoQuote): Quote => {
  const statusMapping = {
    DeclinedForRenegotiation: 'waiting',
    RenegotiationAddressed: 'renegotiating',
    Pending: 'inprogress',
  } as Record<Required<CoCoQuote>['quoteState'], Quote['status']>;

  const status =
    ((
      statusMapping[quote.quoteState as keyof typeof statusMapping] ??
      quote.quoteState ??
      ''
    ).toLocaleLowerCase() as Quote['status']) || 'inprogress';

  return {
    id: quote.quoteId ?? '',
    author: `${quote.quoteRequest?.account?.firstName} ${quote.quoteRequest?.account?.lastName}`,
    status,
    creationDate: quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : '-',
    lastModifiedDate: quote.lastModifiedAt ? new Date(quote.lastModifiedAt).toLocaleDateString() : '-',
    businessUnit: quote.quoteRequest?.businessUnit?.name ?? quote.quoteRequest?.businessUnit?.key ?? '',
    activity: [
      {
        title: 'dashboard.quote.request.submitted',
        comment: quote.quoteRequest?.buyerComment,
        commentBy: 'author',
      },
      ...getQuoteActivity(quote, status),
    ],
    ...getQuoteTransaction(quote),
    items: (quote.lineItems ?? []).map(mapLineItem),
  };
};

export const mapQuoteRequest = (quoteRequest: QuoteRequest): Quote => {
  const statusMapping = {} as Record<Required<QuoteRequest>['quoteRequestState'], Quote['status']>;

  const status =
    ((
      statusMapping[quoteRequest.quoteRequestState as keyof typeof statusMapping] ??
      quoteRequest.quoteRequestState ??
      ''
    ).toLocaleLowerCase() as Quote['status']) || 'inprogress';

  return {
    id: quoteRequest.quoteRequestId ?? '',
    author: `${quoteRequest?.account?.firstName} ${quoteRequest?.account?.lastName}`,
    status,
    creationDate: quoteRequest.createdAt ? new Date(quoteRequest.createdAt).toLocaleDateString() : '-',
    lastModifiedDate: quoteRequest.lastModifiedAt ? new Date(quoteRequest.lastModifiedAt).toLocaleDateString() : '-',
    businessUnit: quoteRequest.businessUnit?.name ?? quoteRequest.businessUnit?.key ?? '',
    activity: [
      {
        title: 'dashboard.quote.request.submitted',
        comment: quoteRequest.buyerComment,
        commentBy: 'author',
      },
      ...getQuoteActivity(quoteRequest, status),
    ],
    ...getQuoteTransaction(quoteRequest),
    items: (quoteRequest.lineItems ?? []).map(mapLineItem),
  };
};
