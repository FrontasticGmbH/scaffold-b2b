import {
  DynamicPageContext,
  DynamicPageRedirectResult,
  DynamicPageSuccessResult,
  ExtensionRegistry,
  Request,
} from '@frontastic/extension-types';
import { getPath } from './utils/Request';
import { ProductRouter } from './utils/ProductRouter';
import { Product } from '@Types/product/Product';
import { SearchRouter } from './utils/SearchRouter';
import { CategoryRouter } from './utils/CategoryRouter';
import dataSources from './dataSources';
import { actions } from './actionControllers';
import WishlistRouter from '@Commerce-commercetools/utils/WishlistRouter';
import QuoteRouter from '@Commerce-commercetools/utils/QuoteRouter';
import CartRouter from '@Commerce-commercetools/utils/CartRouter';
import { Wishlist } from '@Types/wishlist/Wishlist';
import { Quote } from '@Types/quote/Quote';
import { QuoteRequest } from '@Types/quote/QuoteRequest';
import { Order } from '@Types/cart/Order';
import { PaginatedResult, ProductPaginatedResult } from '@Types/result';

export default {
  'dynamic-page-handler': async (
    request: Request,
    context: DynamicPageContext,
  ): Promise<DynamicPageSuccessResult | DynamicPageRedirectResult | null> => {
    // Identify static page
    const staticPageMatch = getPath(request)?.match(
      /^\/(cart|checkout|wishlists|shopping-lists|account|login|register|verify|reset-password|quote-thank-you|quotes)/,
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
      return ProductRouter.loadPreviewFor(request, context.frontasticContext).then((product: Product) => {
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

        // FIXME: Return proper error result
        return null;
      });
    }

    // Identify Product
    if (ProductRouter.identifyFrom(request)) {
      return ProductRouter.loadFor(request, context.frontasticContext).then((product: Product) => {
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

        // FIXME: Return proper error result
        return null;
      });
    }

    // Identify Wishlist
    if (WishlistRouter.identifyFrom(request)) {
      return WishlistRouter.loadFor(request, context.frontasticContext).then((wishlist: PaginatedResult<Wishlist>) => {
        if (wishlist) {
          return {
            dynamicPageType: 'frontastic/shopping-list-page',
            dataSourcePayload: {
              wishlist: wishlist,
            },
            pageMatchingPayload: {
              wishlist: wishlist,
            },
          };
        }

        // FIXME: Return proper error result
        return null;
      });
    }

    // Identify Preview Wishlist
    if (WishlistRouter.identifyPreviewFrom(request)) {
      return WishlistRouter.loadPreviewFor(request, context.frontasticContext).then(
        (wishlist: PaginatedResult<Wishlist>) => {
          if (wishlist) {
            return {
              dynamicPageType: 'frontastic/shopping-list-page',
              dataSourcePayload: {
                wishlist: wishlist,
              },
              pageMatchingPayload: {
                wishlist: wishlist,
              },
            };
          }

          // FIXME: Return proper error result
          return null;
        },
      );
    }

    // Identify Order and preview Order
    if (CartRouter.identifyOrderFrom(request)) {
      return CartRouter.loadOrderFor(request, context.frontasticContext).then((order: Order) => {
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

        // FIXME: Return proper error result
        return null;
      });
    }

    // Identify Orders and preview Orders
    if (CartRouter.identifyOrdersFrom(request)) {
      return CartRouter.loadOrdersFor(request, context.frontasticContext).then((result: PaginatedResult<Order>) => {
        if (result) {
          return {
            dynamicPageType: 'frontastic/orders-page',
            dataSourcePayload: result,
            pageMatchingPayload: result,
          };
        }

        // FIXME: Return proper error result
        return null;
      });
    }

    // Identify Quote and Preview Quote
    if (QuoteRouter.identifyQuoteFrom(request)) {
      return QuoteRouter.loadQuoteFor(request, context.frontasticContext).then((quote: Quote) => {
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

        // FIXME: Return proper error result
        return null;
      });
    }

    // Identify Quote Request and Preview Quote Request
    if (QuoteRouter.identifyQuoteRequestFrom(request)) {
      return QuoteRouter.loadQuoteRequestFor(request, context.frontasticContext).then((quoteRequest: QuoteRequest) => {
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

        // FIXME: Return proper error result
        return null;
      });
    }

    // Identify Quotes and Preview Quotes
    if (QuoteRouter.identifyQuotesFrom(request)) {
      return QuoteRouter.loadQuotesFor(request, context.frontasticContext).then((result: PaginatedResult<Quote>) => {
        if (result) {
          return {
            dynamicPageType: 'frontastic/quotes-page',
            dataSourcePayload: result,
            pageMatchingPayload: result,
          };
        }

        // FIXME: Return proper error result
        return null;
      });
    }

    // Identify Quotes and Preview Quotes
    if (QuoteRouter.identifyQuoteRequestsFrom(request)) {
      return QuoteRouter.loadQuoteRequestsFor(request, context.frontasticContext).then(
        (result: PaginatedResult<QuoteRequest>) => {
          if (result) {
            return {
              dynamicPageType: 'frontastic/quote-requests-page',
              dataSourcePayload: result,
              pageMatchingPayload: result,
            };
          }

          // FIXME: Return proper error result
          return null;
        },
      );
    }

    // Identify Search
    if (SearchRouter.identifyFrom(request)) {
      return SearchRouter.loadFor(request, context.frontasticContext).then((result: ProductPaginatedResult) => {
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

        // FIXME: Return proper error result
        return null;
      });
    }

    // Identify preview list
    if (CategoryRouter.identifyPreviewFrom(request)) {
      return CategoryRouter.loadPreviewFor(request, context.frontasticContext).then(
        (result: ProductPaginatedResult) => {
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

          // FIXME: Return proper error result
          return null;
        },
      );
    }

    if (CategoryRouter.identifyFrom(request)) {
      return CategoryRouter.loadFor(request, context.frontasticContext).then((result: ProductPaginatedResult) => {
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

        // FIXME: Return proper error result
        return null;
      });
    }

    return null;
  },
  'data-sources': dataSources,
  actions,
} as ExtensionRegistry;
