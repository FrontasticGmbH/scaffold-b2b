import { Context, Request } from '@frontastic/extension-types';
import { Quote } from '@Types/quote/Quote';
import { QuoteRequest } from '@Types/quote/QuoteRequest';
import { PaginatedResult } from '@Types/result';
import { QuoteQuery } from '@Types/query/QuoteQuery';
import { getPath } from '../requestHandlers/Request';
import queryParamsToIds from '@Commerce-commercetools/utils/requestHandlers/queryParamsToIds';
import queryParamsToStates from '@Commerce-commercetools/utils/requestHandlers/queryParamsToState';
import getQuoteApi from '@Commerce-commercetools/utils/apiConstructors/getQuoteApi';

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

  static loadQuoteFor = async (request: Request, commercetoolsFrontendContext: Context): Promise<Quote> => {
    const quoteApi = getQuoteApi(request, commercetoolsFrontendContext);

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

  static loadQuoteRequestFor = async (
    request: Request,
    commercetoolsFrontendContext: Context,
  ): Promise<QuoteRequest> => {
    const quoteApi = getQuoteApi(request, commercetoolsFrontendContext);

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
    commercetoolsFrontendContext: Context,
  ): Promise<PaginatedResult<QuoteRequest>> => {
    const quoteApi = getQuoteApi(request, commercetoolsFrontendContext);
    const urlMatches = getPath(request)?.match(quotesRegex) ?? getPath(request)?.match(quotesPreviewRegex) ?? null;

    if (urlMatches) {
      const quoteQuery = this.buildQuoteQuery(request);

      return await quoteApi.query(quoteQuery);
    }

    return null;
  };

  static loadQuoteRequestsFor = async (
    request: Request,
    commercetoolsFrontendContext: Context,
  ): Promise<PaginatedResult<QuoteRequest>> => {
    const quoteApi = getQuoteApi(request, commercetoolsFrontendContext);
    const urlMatches =
      getPath(request)?.match(quoteRequestRegex) ?? getPath(request)?.match(quoteRequestPreviewRegex) ?? null;

    if (urlMatches) {
      const quoteQuery = this.buildQuoteQuery(request);

      return await quoteApi.queryQuoteRequests(quoteQuery);
    }

    return null;
  };

  private static buildQuoteQuery(request: Request): QuoteQuery {
    return {
      accountId: request.query?.accountId ?? undefined,
      limit: request.query?.limit ?? undefined,
      cursor: request.query?.cursor ?? undefined,
      quoteIds: queryParamsToIds('quoteIds', request.query),
      quoteStates: queryParamsToStates('quoteStates', request.query),
      // sortAttributes: queryParamsToSortAttributes(request.query),
      query: request.query?.query ?? undefined,
    };
  }
}
