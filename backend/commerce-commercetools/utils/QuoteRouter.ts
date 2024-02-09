import { Context, Request } from '@frontastic/extension-types';
import { Quote } from '@Types/quote/Quote';
import { QuoteRequest } from '@Types/quote/QuoteRequest';
import { PaginatedResult } from '@Types/result';
import { QuoteQuery } from '@Types/query/QuoteQuery';
import { Account } from '@Types/account';
import { QuoteApi } from '../apis/QuoteApi';
import { getCurrency, getLocale, getPath } from './Request';
import queryParamsToIds from '@Commerce-commercetools/utils/queryParamsToIds';
import queryParamsToStates from '@Commerce-commercetools/utils/queryParamsToState';
import { fetchAccountFromSessionEnsureLoggedIn } from '@Commerce-commercetools/utils/fetchAccountFromSession';
import getQuoteApi from '@Commerce-commercetools/utils/getQuoteApi';

const quoteRegex = /\/quote\/([^\/]+)/;
const quotePreviewRegex = /\/preview\/.+\/quote\/([^\/]+)/;
const quoteRequestRegex = /\/quote-request\/([^\/]+)/;
const quoteRequestPreviewRegex = /\/preview\/.+\/quote-request\/([^\/]+)/;
const quotesRegex = /\/quotes/;
const quoteRequestsRegex = /\/quote-requests/;
const quotesPreviewRegex = /\/preview\/.+\/quotes/;
const quoteRequestsPreviewRegex = /\/preview\/.+\/quote-requests/;

export default class QuoteRouter {
  static identifyQuoteFrom(request: Request) {
    if (getPath(request)?.match(quoteRegex) || getPath(request)?.match(quotePreviewRegex)) {
      return true;
    }

    return false;
  }

  static identifyQuoteRequestFrom(request: Request) {
    if (getPath(request)?.match(quoteRequestRegex) || getPath(request)?.match(quoteRequestPreviewRegex)) {
      return true;
    }

    return false;
  }

  static identifyQuotesFrom(request: Request) {
    if (getPath(request)?.match(quotesRegex) || getPath(request)?.match(quotesPreviewRegex)) {
      return true;
    }

    return false;
  }

  static identifyQuoteRequestsFrom(request: Request) {
    if (getPath(request)?.match(quoteRequestsRegex) || getPath(request)?.match(quoteRequestsPreviewRegex)) {
      return true;
    }

    return false;
  }

  static loadQuoteFor = async (request: Request, frontasticContext: Context): Promise<Quote> => {
    const quoteApi = getQuoteApi(request, frontasticContext);

    let urlMatches = getPath(request)?.match(quoteRegex);

    if (urlMatches) {
      return await quoteApi.getQuote(urlMatches[1]);
    }

    urlMatches = getPath(request)?.match(quotePreviewRegex);

    if (urlMatches) {
      return await quoteApi.getQuote(urlMatches[1]);
    }

    return null;
  };

  static loadQuoteRequestFor = async (request: Request, frontasticContext: Context): Promise<QuoteRequest> => {
    const quoteApi = getQuoteApi(request, frontasticContext);

    let urlMatches = getPath(request)?.match(quoteRequestRegex);

    if (urlMatches) {
      return await quoteApi.getQuoteRequest(urlMatches[1]);
    }

    urlMatches = getPath(request)?.match(quoteRequestPreviewRegex);

    if (urlMatches) {
      return await quoteApi.getQuoteRequest(urlMatches[1]);
    }

    return null;
  };

  static loadQuotesFor = async (
    request: Request,
    frontasticContext: Context,
  ): Promise<PaginatedResult<QuoteRequest>> => {
    const quoteApi = getQuoteApi(request, frontasticContext);
    const urlMatches = getPath(request)?.match(quotesRegex) ?? getPath(request)?.match(quotesPreviewRegex) ?? null;

    if (urlMatches) {
      const account = fetchAccountFromSessionEnsureLoggedIn(request);

      const quoteQuery = this.buildQuoteQuery(request, account);

      return await quoteApi.query(quoteQuery);
    }

    return null;
  };

  static loadQuoteRequestsFor = async (
    request: Request,
    frontasticContext: Context,
  ): Promise<PaginatedResult<QuoteRequest>> => {
    const quoteApi = new QuoteApi(frontasticContext, getLocale(request), getCurrency(request));

    const urlMatches =
      getPath(request)?.match(quoteRequestRegex) ?? getPath(request)?.match(quoteRequestPreviewRegex) ?? null;

    if (urlMatches) {
      const account = fetchAccountFromSessionEnsureLoggedIn(request);

      const quoteQuery = this.buildQuoteQuery(request, account);

      return await quoteApi.queryQuoteRequests(quoteQuery);
    }

    return null;
  };

  private static buildQuoteQuery(request: Request, account: Account): QuoteQuery {
    return {
      accountId: account.accountId,
      limit: request.query?.limit ?? undefined,
      cursor: request.query?.cursor ?? undefined,
      quoteIds: queryParamsToIds('quoteIds', request.query),
      quoteStates: queryParamsToStates('quoteStates', request.query),
      // sortAttributes: queryParamsToSortAttributes(request.query),
      query: request.query?.query ?? undefined,
    };
  }
}
