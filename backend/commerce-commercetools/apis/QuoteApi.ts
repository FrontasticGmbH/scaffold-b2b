import { QuoteRequestDraft } from '@commercetools/platform-sdk';
import { Cart } from '@Types/cart/Cart';
import { QuoteRequest, QuoteRequestState } from '@Types/quote/QuoteRequest';
import { Quote, QuoteState } from '@Types/quote/Quote';
import { QuoteQuery } from '@Types/query/QuoteQuery';
import { PaginatedResult } from '@Types/result';
import { Context } from '@frontastic/extension-types';
import { QuoteMapper } from '../mappers/QuoteMapper';
import { BaseApi } from './BaseApi';
import { ResourceNotFoundError } from '@Commerce-commercetools/errors/ResourceNotFoundError';
import { ProductMapper } from '@Commerce-commercetools/mappers/ProductMapper';
import { getOffsetFromCursor } from '@Commerce-commercetools/utils/Pagination';
import { ExternalError } from '@Commerce-commercetools/errors/ExternalError';

export class QuoteApi extends BaseApi {
  protected accountId: string;
  protected businessUnitKey: string;

  constructor(
    context: Context,
    locale: string | null,
    currency: string | null,
    accountId?: string,
    businessUnitKey?: string,
  ) {
    super(context, locale, currency);
    this.accountId = accountId;
    this.businessUnitKey = businessUnitKey;
  }

  async createQuoteRequest(quoteDraft: QuoteRequest, cart: Cart): Promise<QuoteRequest> {
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

    return this.associateEndpoints(this.accountId, this.businessUnitKey)
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
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async getQuoteRequest(quoteRequestId: string): Promise<QuoteRequest> {
    const locale = await this.getCommercetoolsLocal();

    const quoteRequest = await this.associateEndpoints(this.accountId, this.businessUnitKey)
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

        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });

    const stageQuoteWhereClause = [`quoteRequest(id="${quoteRequest.quoteRequestId}")`];

    await this.requestBuilder()
      .stagedQuotes()
      .get({
        queryArgs: {
          where: stageQuoteWhereClause,
        },
      })
      .execute()
      .then((response) => {
        if (response.body.results.length !== 0) {
          QuoteMapper.updateQuoteRequestFromCommercetoolsStagedQuote(quoteRequest, response.body.results[0]);
        }
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });

    return quoteRequest;
  }

  async getQuote(quoteId: string): Promise<Quote> {
    const locale = await this.getCommercetoolsLocal();
    return this.requestBuilder()
      .quotes()
      .withId({ ID: quoteId })
      .get({
        queryArgs: {
          expand: ['customer', 'quoteRequest', 'quoteRequest.customer', 'stagedQuote'],
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

        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async query(quoteQuery: QuoteQuery): Promise<PaginatedResult<Quote>> {
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

    const whereClause = [];
    if (quoteQuery.quoteIds !== undefined && quoteQuery.quoteIds.length !== 0) {
      whereClause.push(`id in ("${quoteQuery.quoteIds.join('","')}")`);
    }
    if (quoteQuery.quoteStates !== undefined && quoteQuery.quoteStates.length > 0) {
      whereClause.push(`quoteState in ("${quoteQuery.quoteStates.join('","')}")`);
    }
    const searchQuery = quoteQuery.query && quoteQuery.query;

    return this.associateEndpoints(this.accountId, this.businessUnitKey)
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

        return {
          total: response.body.total,
          items: quotes,
          count: response.body.count,
          previousCursor: ProductMapper.calculatePreviousCursor(response.body.offset, response.body.count),
          nextCursor: ProductMapper.calculateNextCursor(response.body.offset, response.body.count, response.body.total),
          query: quoteQuery,
        };
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async queryQuoteRequests(quoteQuery: QuoteQuery): Promise<PaginatedResult<QuoteRequest>> {
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

    const quoteRequestWhereClause = [];
    if (quoteQuery.quoteIds !== undefined && quoteQuery.quoteIds.length !== 0) {
      quoteRequestWhereClause.push(`id in ("${quoteQuery.quoteIds.join('","')}")`);
    }

    if (quoteQuery.quoteStates !== undefined && quoteQuery.quoteStates.length > 0) {
      const quoteRequestStates = quoteQuery.quoteStates.filter((state) => {
        return state !== QuoteRequestState.InProgress && state !== QuoteRequestState.Sent;
      });

      if (
        quoteQuery.quoteStates.includes(QuoteRequestState.InProgress) ||
        quoteQuery.quoteStates.includes(QuoteRequestState.Sent)
      ) {
        quoteRequestStates.push(QuoteRequestState.Accepted);
      }
      quoteRequestWhereClause.push(`quoteRequestState in ("${quoteRequestStates.join('","')}")`);
    }

    const searchQuery = quoteQuery.query && quoteQuery.query;

    const result = await this.associateEndpoints(this.accountId, this.businessUnitKey)
      .quoteRequests()
      .get({
        queryArgs: {
          where: quoteRequestWhereClause,
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

        const result: PaginatedResult<QuoteRequest> = {
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
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });

    if (result.items.length === 0) {
      return result;
    }

    const stagedQuoteStates = quoteQuery.quoteStates.filter((state) => {
      return (
        state === QuoteRequestState.InProgress || state === QuoteRequestState.Sent || state === QuoteRequestState.Closed
      );
    });

    const stageQuoteWhereClause = [
      `quoteRequest(id in (${(result.items as QuoteRequest[])
        .map((quoteRequest) => `"${quoteRequest.quoteRequestId}"`)
        .join(' ,')}))`,
    ];

    if (stagedQuoteStates !== undefined && stagedQuoteStates.length > 0) {
      stageQuoteWhereClause.push(`stagedQuoteState in ("${stagedQuoteStates.join('","')}")`);
    }

    await this.requestBuilder()
      .stagedQuotes()
      .get({
        queryArgs: {
          where: stageQuoteWhereClause,
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
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });

    return result;
  }

  async acceptQuote(quoteId: string): Promise<Quote> {
    const locale = await this.getCommercetoolsLocal();

    return this.getQuote(quoteId).then(async (quote) => {
      return this.associateEndpoints(this.accountId, this.businessUnitKey)
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
          throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
        });
    });
  }

  async declineQuote(quoteId: string): Promise<Quote> {
    const locale = await this.getCommercetoolsLocal();

    return this.getQuote(quoteId).then(async (quote) => {
      return this.associateEndpoints(this.accountId, this.businessUnitKey)
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
          throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
        });
    });
  }

  async renegotiateQuote(quoteId: string, buyerComment?: string): Promise<Quote> {
    const locale = await this.getCommercetoolsLocal();

    return this.getQuote(quoteId).then(async (quote) => {
      return this.associateEndpoints(this.accountId, this.businessUnitKey)
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
          throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
        });
    });
  }

  async cancelQuoteRequest(quoteRequestId: string): Promise<QuoteRequest> {
    const locale = await this.getCommercetoolsLocal();

    return this.getQuoteRequest(quoteRequestId).then(async (quoteRequest) => {
      return this.associateEndpoints(this.accountId, this.businessUnitKey)
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
          throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
        });
    });
  }
}
