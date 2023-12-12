import { QuoteRequestDraft } from '@commercetools/platform-sdk';
import { BaseApi } from './BaseApi';
import { QuoteMapper } from '../mappers/QuoteMapper';
import { Cart } from '@Types/cart/Cart';
import { QuoteRequest, QuoteRequestState } from '@Types/quote/QuoteRequest';
import { Quote, QuoteState } from '@Types/quote/Quote';
import { ExternalError } from '@Commerce-commercetools/utils/Errors';
import { QuoteQuery } from '@Types/query/QuoteQuery';
import { getOffsetFromCursor } from '@Commerce-commercetools/utils/Pagination';
import { Result } from '@Types/quote/Result';
import { ProductMapper } from '@Commerce-commercetools/mappers/ProductMapper';
import { ResourceNotFoundError } from '@Commerce-commercetools/errors/ResourceNotFoundError';

export class QuoteApi extends BaseApi {
  createQuoteRequest: (quoteDraft: QuoteRequest, cart: Cart) => Promise<QuoteRequest> = async (
    quoteDraft: QuoteRequest,
    cart: Cart,
  ) => {
    const cartVersion = parseInt(cart.cartVersion, 10);
    const locale = await this.getCommercetoolsLocal();

    const quoteRequest: QuoteRequestDraft = {
      cart: {
        typeId: 'cart',
        id: cart.cartId,
      },
      cartVersion,
      comment: quoteDraft.buyerComment,
    };

    return this.requestBuilder()
      .quoteRequests()
      .post({
        body: {
          ...quoteRequest,
        },
      })
      .execute()
      .then((response) => {
        return QuoteMapper.commercetoolsQuoteRequestToQuoteRequest(response.body, locale);
      })
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  };

  getQuoteRequest: (quoteRequestId: string) => Promise<QuoteRequest> = async (quoteRequestId: string) => {
    const locale = await this.getCommercetoolsLocal();

    return this.requestBuilder()
      .quoteRequests()
      .withId({ ID: quoteRequestId })
      .get({
        queryArgs: {
          expand: ['customer'],
        },
      })
      .execute()
      .then((response) => {
        return QuoteMapper.commercetoolsQuoteRequestToQuoteRequest(response.body, locale);
      })
      .catch((error) => {
        if (error.code === 404) {
          throw new ResourceNotFoundError({ message: error.message });
        }

        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  };

  getQuote: (quoteId: string) => Promise<Quote> = async (quoteId: string) => {
    const locale = await this.getCommercetoolsLocal();
    return this.requestBuilder()
      .quotes()
      .withId({ ID: quoteId })
      .get({
        queryArgs: {
          expand: ['customer', 'quoteRequest', 'stagedQuote'],
        },
      })
      .execute()
      .then((response) => {
        return QuoteMapper.commercetoolsQuoteToQuote(response.body, locale);
      })
      .catch((error) => {
        if (error.code === 404) {
          throw new ResourceNotFoundError({ message: error.message });
        }

        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  };

  query: (quoteQuery: QuoteQuery) => Promise<Result> = async (quoteQuery: QuoteQuery) => {
    const locale = await this.getCommercetoolsLocal();
    const limit = +quoteQuery.limit || undefined;
    const sortAttributes: string[] = [];

    if (quoteQuery.sortAttributes !== undefined) {
      Object.keys(quoteQuery.sortAttributes).map((field, directionIndex) => {
        sortAttributes.push(`${field} ${Object.values(quoteQuery.sortAttributes)[directionIndex]}`);
      });
    } else {
      // default sort
      sortAttributes.push(`lastModifiedAt desc`);
    }

    const whereClause = [`customer(id="${quoteQuery.accountId}")`];
    if (quoteQuery.quoteIds !== undefined && quoteQuery.quoteIds.length !== 0) {
      whereClause.push(`id in ("${quoteQuery.quoteIds.join('","')}")`);
    }
    if (quoteQuery.quoteStates !== undefined && quoteQuery.quoteStates.length > 0) {
      whereClause.push(`quoteState in ("${quoteQuery.quoteStates.join('","')}")`);
    }
    const searchQuery = quoteQuery.query && quoteQuery.query;

    return this.requestBuilder()
      .quotes()
      .get({
        queryArgs: {
          where: whereClause,
          expand: ['quoteRequest', 'stagedQuote'],
          limit: limit,
          offset: getOffsetFromCursor(quoteQuery.cursor),
          sort: sortAttributes,
          [`text.${locale.language}`]: searchQuery,
        },
      })
      .execute()
      .then((response) => {
        const quotes = response.body.results.map((commercetoolsQuote) => {
          return QuoteMapper.commercetoolsQuoteToQuote(commercetoolsQuote, locale);
        });

        const result: Result = {
          total: response.body.total,
          items: quotes,
          count: response.body.count,
          previousCursor: ProductMapper.calculatePreviousCursor(response.body.offset, response.body.count),
          nextCursor: ProductMapper.calculateNextCursor(response.body.offset, response.body.count, response.body.total),
          query: quoteQuery,
        };
        return result;
      })
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  };

  queryQuoteRequests: (quoteQuery: QuoteQuery) => Promise<Result> = async (quoteQuery: QuoteQuery) => {
    const locale = await this.getCommercetoolsLocal();
    const limit = +quoteQuery.limit || undefined;
    const sortAttributes: string[] = [];

    if (quoteQuery.sortAttributes !== undefined) {
      Object.keys(quoteQuery.sortAttributes).map((field, directionIndex) => {
        sortAttributes.push(`${field} ${Object.values(quoteQuery.sortAttributes)[directionIndex]}`);
      });
    } else {
      // default sort
      sortAttributes.push(`lastModifiedAt desc`);
    }

    const whereClause = [`customer(id="${quoteQuery.accountId}")`];
    if (quoteQuery.quoteIds !== undefined && quoteQuery.quoteIds.length !== 0) {
      whereClause.push(`id in ("${quoteQuery.quoteIds.join('","')}")`);
    }
    if (quoteQuery.quoteStates !== undefined && quoteQuery.quoteStates.length > 0) {
      whereClause.push(`quoteRequestState in ("${quoteQuery.quoteStates.join('","')}")`);
    }
    const searchQuery = quoteQuery.query && quoteQuery.query;

    const result = await this.requestBuilder()
      .quoteRequests()
      .get({
        queryArgs: {
          where: whereClause,
          sort: sortAttributes,
          limit: limit,
          offset: getOffsetFromCursor(quoteQuery.cursor),
          [`text.${locale.language}`]: searchQuery,
          expand: ['customer'],
        },
      })
      .execute()
      .then((response) => {
        const quoteRequests = response.body.results.map((commercetoolsQuoteRequest) => {
          return QuoteMapper.commercetoolsQuoteRequestToQuoteRequest(commercetoolsQuoteRequest, locale);
        });

        const result: Result = {
          total: response.body.total,
          items: quoteRequests,
          count: response.body.count,
          previousCursor: ProductMapper.calculatePreviousCursor(response.body.offset, response.body.count),
          nextCursor: ProductMapper.calculateNextCursor(response.body.offset, response.body.count, response.body.total),
          query: quoteQuery,
        };
        return result;
      })
      .catch((error) => {
        throw error;
      });

    const quoteRequestIdsWhereClause = `quoteRequest(id in (${(result.items as QuoteRequest[])
      .map((quoteRequest) => `"${quoteRequest.quoteRequestId}"`)
      .join(' ,')}))`;

    await this.requestBuilder()
      .stagedQuotes()
      .get({
        queryArgs: {
          where: quoteRequestIdsWhereClause,
        },
      })
      .execute()
      .then((response) => {
        return response.body.results.map((commercetoolsStagedQuote) => {
          const quoteToUpdate = (result.items as QuoteRequest[]).find(
            (quoteRequest) => quoteRequest.quoteRequestId === commercetoolsStagedQuote.quoteRequest.id,
          );

          if (quoteToUpdate) {
            QuoteMapper.updateQuoteRequestFromCommercetoolsStagedQuote(quoteToUpdate, commercetoolsStagedQuote);
          }
        });
      })
      .catch((error) => {
        throw error;
      });

    return result;
  };

  acceptQuote: (quoteId: string) => Promise<Quote> = async (quoteId: string) => {
    const locale = await this.getCommercetoolsLocal();

    return this.getQuote(quoteId).then((quote) => {
      return this.requestBuilder()
        .quotes()
        .withId({ ID: quoteId })
        .post({
          queryArgs: {
            expand: ['quoteRequest', 'quoteRequest.customer', 'stagedQuote.quotationCart'],
          },
          body: {
            actions: [
              {
                action: 'changeQuoteState',
                quoteState: QuoteState.Accepted,
              },
            ],
            version: quote.quoteVersion,
          },
        })
        .execute()
        .then((response) => {
          return QuoteMapper.commercetoolsQuoteToQuote(response.body, locale);
        })
        .catch((error) => {
          throw new ExternalError({ status: error.code, message: error.message, body: error.body });
        });
    });
  };

  declineQuote: (quoteId: string) => Promise<Quote> = async (quoteId: string) => {
    const locale = await this.getCommercetoolsLocal();

    return this.getQuote(quoteId).then((quote) => {
      return this.requestBuilder()
        .quotes()
        .withId({ ID: quoteId })
        .post({
          queryArgs: {
            expand: ['quoteRequest', 'quoteRequest.customer'],
          },
          body: {
            actions: [
              {
                action: 'changeQuoteState',
                quoteState: QuoteState.Declined,
              },
            ],
            version: quote.quoteVersion,
          },
        })
        .execute()
        .then((response) => {
          return QuoteMapper.commercetoolsQuoteToQuote(response.body, locale);
        })
        .catch((error) => {
          throw new ExternalError({ status: error.code, message: error.message, body: error.body });
        });
    });
  };

  renegotiateQuote: (quoteId: string, buyerComment?: string) => Promise<Quote> = async (
    quoteId: string,
    buyerComment?: string,
  ) => {
    const locale = await this.getCommercetoolsLocal();

    return this.getQuote(quoteId).then((quote) => {
      return this.requestBuilder()
        .quotes()
        .withId({ ID: quoteId })
        .post({
          queryArgs: {
            expand: ['quoteRequest', 'quoteRequest.customer'],
          },
          body: {
            actions: [
              {
                action: 'requestQuoteRenegotiation',
                buyerComment: buyerComment,
              },
            ],
            version: quote.quoteVersion,
          },
        })
        .execute()
        .then((response) => {
          return QuoteMapper.commercetoolsQuoteToQuote(response.body, locale);
        })
        .catch((error) => {
          throw new ExternalError({ status: error.code, message: error.message, body: error.body });
        });
    });
  };

  cancelQuoteRequest: (quoteRequestId: string) => Promise<QuoteRequest> = async (quoteRequestId: string) => {
    const locale = await this.getCommercetoolsLocal();

    return this.getQuoteRequest(quoteRequestId).then((quoteRequest) => {
      return this.requestBuilder()
        .quoteRequests()
        .withId({ ID: quoteRequestId })
        .post({
          body: {
            actions: [
              {
                action: 'changeQuoteRequestState',
                quoteRequestState: QuoteRequestState.Cancelled,
              },
            ],
            version: quoteRequest.quoteRequestVersion,
          },
        })
        .execute()
        .then((response) => {
          return QuoteMapper.commercetoolsQuoteRequestToQuoteRequest(response.body, locale);
        })
        .catch((error) => {
          throw new ExternalError({ status: error.code, message: error.message, body: error.body });
        });
    });
  };
}
