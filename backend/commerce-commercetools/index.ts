import {
  DynamicPageContext,
  DynamicPageRedirectResult,
  DynamicPageSuccessResult,
  ExtensionRegistry,
  Request,
} from '@frontastic/extension-types';
import { Product } from '@Types/product/Product';
import { Wishlist } from '@Types/wishlist/Wishlist';
import { Quote } from '@Types/quote/Quote';
import { QuoteRequest } from '@Types/quote/QuoteRequest';
import { Order } from '@Types/cart/Order';
import { PaginatedResult, ProductPaginatedResult } from '@Types/result';
import { actions } from './actionControllers';
import dataSources from './dataSources';
import CategoryRouter from './utils/routers/CategoryRouter';
import SearchRouter from './utils/routers/SearchRouter';
import ProductRouter from './utils/routers/ProductRouter';
import { getPath } from './utils/requestHandlers/Request';
import CartRouter from '@Commerce-commercetools/utils/routers/CartRouter';
import QuoteRouter from '@Commerce-commercetools/utils/routers/QuoteRouter';
import WishlistRouter from '@Commerce-commercetools/utils/routers/WishlistRouter';
import handleError from '@Commerce-commercetools/utils/handleError';

export default {
  'dynamic-page-handler': async (
    request: Request,
    context: DynamicPageContext,
  ): Promise<DynamicPageSuccessResult | DynamicPageRedirectResult | null> => {
    try {
      // Identify static page
      const staticPageMatch = getPath(request)?.match(
        /^\/(cart|checkout|wishlists|purchase-lists|account|login|register|verify-associate|verify|reset-password|quote-thank-you|quotes)/,
      );

      if (staticPageMatch) {
        return {
          dynamicPageType: `frontastic${staticPageMatch[0]}`,
          dataSourcePayload: {},
          pageMatchingPayload: {},
        } as DynamicPageSuccessResult;
      }

      // Identify Product Preview
      if (ProductRouter.identifyPreviewFrom(request)) {
        const product: Product = await ProductRouter.loadPreviewFor(request, context.frontasticContext);

        if (product) {
          return {
            dynamicPageType: 'frontastic/product-page',
            dataSourcePayload: {
              product: product,
            },
            pageMatchingPayload: {
              product: product,
            },
          };
        }
        return null;
      }

      // Identify Product
      if (ProductRouter.identifyFrom(request)) {
        const product: Product = await ProductRouter.loadFor(request, context.frontasticContext);

        if (product) {
          return {
            dynamicPageType: 'frontastic/product-page',
            dataSourcePayload: {
              product: product,
            },
            pageMatchingPayload: {
              product: product,
            },
          };
        }
        return null;
      }

      // Identify Wishlist
      if (WishlistRouter.identifyFrom(request)) {
        const wishlist: PaginatedResult<Wishlist> = await WishlistRouter.loadFor(request, context.frontasticContext);

        if (wishlist) {
          return {
            dynamicPageType: 'frontastic/purchase-list-page',
            dataSourcePayload: {
              wishlist: wishlist,
            },
            pageMatchingPayload: {
              wishlist: wishlist,
            },
          };
        }
        return null;
      }

      // Identify Preview Wishlist
      if (WishlistRouter.identifyPreviewFrom(request)) {
        const wishlist: PaginatedResult<Wishlist> = await WishlistRouter.loadPreviewFor(
          request,
          context.frontasticContext,
        );

        if (wishlist) {
          return {
            dynamicPageType: 'frontastic/purchase-list-page',
            dataSourcePayload: {
              wishlist: wishlist,
            },
            pageMatchingPayload: {
              wishlist: wishlist,
            },
          };
        }
        return null;
      }

      // Identify Order and preview Order
      if (CartRouter.identifyOrderFrom(request)) {
        const order: Order = await CartRouter.loadOrderFor(request, context.frontasticContext);

        if (order) {
          return {
            dynamicPageType: CartRouter.getOrderPageType(request),
            dataSourcePayload: {
              order,
            },
            pageMatchingPayload: {
              order,
            },
          };
        }
        return null;
      }

      // Identify Orders and preview Orders
      if (CartRouter.identifyOrdersFrom(request)) {
        const result: PaginatedResult<Order> = await CartRouter.loadOrdersFor(request, context.frontasticContext);

        if (result) {
          return {
            dynamicPageType: 'frontastic/orders-page',
            dataSourcePayload: result,
            pageMatchingPayload: result,
          };
        }
        return null;
      }

      // Identify Quote and Preview Quote
      if (QuoteRouter.identifyQuoteFrom(request)) {
        const quote: Quote = await QuoteRouter.loadQuoteFor(request, context.frontasticContext);

        if (quote) {
          return {
            dynamicPageType: 'frontastic/quote-page',
            dataSourcePayload: {
              quote,
            },
            pageMatchingPayload: {
              quote,
            },
          };
        }
        return null;
      }

      // Identify Quote Request and Preview Quote Request
      if (QuoteRouter.identifyQuoteRequestFrom(request)) {
        const quoteRequest: QuoteRequest = await QuoteRouter.loadQuoteRequestFor(request, context.frontasticContext);

        if (quoteRequest) {
          return {
            dynamicPageType: 'frontastic/quote-request-page',
            dataSourcePayload: {
              quoteRequest,
            },
            pageMatchingPayload: {
              quoteRequest,
            },
          };
        }
        return null;
      }

      // Identify Quotes and Preview Quotes
      if (QuoteRouter.identifyQuotesFrom(request)) {
        const result: PaginatedResult<Quote> = await QuoteRouter.loadQuotesFor(request, context.frontasticContext);

        if (result) {
          return {
            dynamicPageType: 'frontastic/quotes-page',
            dataSourcePayload: result,
            pageMatchingPayload: result,
          };
        }
        return null;
      }

      // Identify Quotes Requests and Preview Quotes
      if (QuoteRouter.identifyQuoteRequestsFrom(request)) {
        const result: PaginatedResult<QuoteRequest> = await QuoteRouter.loadQuoteRequestsFor(
          request,
          context.frontasticContext,
        );

        if (result) {
          return {
            dynamicPageType: 'frontastic/quote-requests-page',
            dataSourcePayload: result,
            pageMatchingPayload: result,
          };
        }
        return null;
      }

      // Identify Search
      if (SearchRouter.identifyFrom(request)) {
        const result: ProductPaginatedResult = await SearchRouter.loadFor(request, context.frontasticContext);

        if (result) {
          return {
            dynamicPageType: 'frontastic/search',
            dataSourcePayload: {
              totalItems: result.total,
              ...result,
            },
            pageMatchingPayload: {
              query: result.query,
            },
          };
        }
        return null;
      }

      // Identify preview list
      if (CategoryRouter.identifyPreviewFrom(request)) {
        const result: ProductPaginatedResult = await CategoryRouter.loadPreviewFor(request, context.frontasticContext);

        if (result) {
          return {
            dynamicPageType: 'frontastic/category',
            dataSourcePayload: {
              totalItems: result.total,
              items: result.items,
              facets: result.facets,
              previousCursor: result.previousCursor,
              nextCursor: result.nextCursor,
              category: getPath(request),
              isPreview: true,
            },
            pageMatchingPayload: {
              totalItems: result.total,
              items: result.items,
              facets: result.facets,
              previousCursor: result.previousCursor,
              nextCursor: result.nextCursor,
              category: getPath(request),
              isPreview: true,
            },
          };
        }
        return null;
      }

      if (CategoryRouter.identifyFrom(request)) {
        const result: ProductPaginatedResult = await CategoryRouter.loadFor(request, context.frontasticContext);

        if (result) {
          return {
            dynamicPageType: 'frontastic/category',
            dataSourcePayload: {
              totalItems: result.total,
              items: result.items,
              facets: result.facets,
              previousCursor: result.previousCursor,
              nextCursor: result.nextCursor,
              category: getPath(request),
            },
            pageMatchingPayload: {
              totalItems: result.total,
              items: result.items,
              facets: result.facets,
              previousCursor: result.previousCursor,
              nextCursor: result.nextCursor,
              category: getPath(request),
            },
          };
        }
        return null;
      }

      return null;
    } catch (error) {
      if (context.frontasticContext.environment !== 'production') {
        return {
          dynamicPageType: 'frontastic/error',
          dataSourcePayload: handleError(error, request),
        };
      }
      return null;
    }
  },
  'data-sources': dataSources,
  actions,
} as ExtensionRegistry;
