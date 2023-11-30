import { Context, Request } from '@frontastic/extension-types';
import { getCurrency, getLocale, getPath } from './Request';
import { Quote } from '@Types/quote/Quote';
import { QuoteApi } from '../apis/QuoteApi';
import { QuoteRequest } from '@Types/quote/QuoteRequest';
import { ResourceNotFoundError } from '@Commerce-commercetools/errors/ResourceNotFoundError';

export default class QuoteRouter {
  static identifyFrom(request: Request) {
    if (getPath(request)?.match(/\/(quote|quote-request)\/([^\/]+)/)) {
      return true;
    }

    return false;
  }

  static identifyPreviewFrom(request: Request) {
    if (getPath(request)?.match(/\/preview\/.+\/(quote|quote-request)\/([^\/]+)/)) {
      return true;
    }

    return false;
  }

  static loadFor = async (request: Request, frontasticContext: Context): Promise<Quote | QuoteRequest> => {
    const quoteApi = new QuoteApi(frontasticContext, getLocale(request), getCurrency(request));

    const quoteUrlMatches = getPath(request)?.match(/\/quote\/([^\/]+)/);

    if (quoteUrlMatches) {
      const quote = await quoteApi
        .getQuote(quoteUrlMatches[1])
        .then((quote) => {
          return quote;
        })
        .catch((error) => {
          if (!(error instanceof ResourceNotFoundError)) {
            throw error;
          }
        });

      if (quote) {
        return quote;
      }

      const quoteRequest = await quoteApi
        .getQuoteRequest(quoteUrlMatches[1])
        .then((quoteRequest) => {
          return quoteRequest;
        })
        .catch((error) => {
          if (!(error instanceof ResourceNotFoundError)) {
            throw error;
          }
        });

      if (quoteRequest) {
        return quoteRequest;
      }
    }

    const quoteRequestUrlMatches = getPath(request)?.match(/\/quote\/([^\/]+)/);

    if (quoteRequestUrlMatches) {
      const quoteRequest = await quoteApi
        .getQuoteRequest(quoteRequestUrlMatches[1])
        .then((quoteRequest) => {
          return quoteRequest;
        })
        .catch((error) => {
          if (!(error instanceof ResourceNotFoundError)) {
            throw error;
          }
        });

      if (quoteRequest) {
        return quoteRequest;
      }
    }

    return null;
  };

  static loadPreviewFor = async (request: Request, frontasticContext: Context): Promise<Quote | QuoteRequest> => {
    const wishlistApi = new QuoteApi(frontasticContext, getLocale(request), getCurrency(request));

    const quoteUrlMatches = getPath(request)?.match(/\/preview\/.+\/quote\/([^\/]+)/);

    if (quoteUrlMatches) {
      return wishlistApi.getQuote(quoteUrlMatches[1]);
    }

    const quoteRequestUrlMatches = getPath(request)?.match(/\/preview\/.+\/quote-request\/([^\/]+)/);

    if (quoteRequestUrlMatches) {
      return wishlistApi.getQuoteRequest(quoteRequestUrlMatches[1]);
    }

    return null;
  };
}
