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
import { Result } from '@Types/product/Result';
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

export default {
  'dynamic-page-handler': async (
    request: Request,
    context: DynamicPageContext,
  ): Promise<DynamicPageSuccessResult | DynamicPageRedirectResult | null> => {
    // Identify static page
    const staticPageMatch = getPath(request)?.match(
      /^\/(cart|checkout|wishlists|shopping-lists|account|login|register|verify|reset-password|thank-you|quote-thank-you|quotes|orders)/,
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
            dynamicPageType: 'frontastic/product-detail-page',
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
            dynamicPageType: 'frontastic/product-detail-page',
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
      return WishlistRouter.loadFor(request, context.frontasticContext).then((wishlist: Wishlist) => {
        if (wishlist) {
          return {
            dynamicPageType: 'frontastic/shopping-list-detail-page',
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
      return WishlistRouter.loadPreviewFor(request, context.frontasticContext).then((wishlist: Wishlist) => {
        if (wishlist) {
          return {
            dynamicPageType: 'frontastic/shopping-list-detail-page',
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

    // Identify Order
    if (CartRouter.identifyOrderFrom(request)) {
      return CartRouter.loadOrderFor(request, context.frontasticContext).then((order: Order) => {
        if (order) {
          return {
            dynamicPageType: 'frontastic/order-detail-page',
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

    // Identify Preview Order
    if (CartRouter.identifyOrderPreviewFrom(request)) {
      return CartRouter.loadOrderPreviewFor(request, context.frontasticContext).then((order: Order) => {
        if (order) {
          return {
            dynamicPageType: 'frontastic/order-detail-page',
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

    // Identify Quote
    if (QuoteRouter.identifyFrom(request)) {
      return QuoteRouter.loadFor(request, context.frontasticContext).then((quote: Quote | QuoteRequest) => {
        if (quote) {
          return {
            dynamicPageType: 'frontastic/quote-detail-page',
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

    // Identify Preview Quote
    if (QuoteRouter.identifyPreviewFrom(request)) {
      return QuoteRouter.loadPreviewFor(request, context.frontasticContext).then((quote: Quote | QuoteRequest) => {
        if (quote) {
          return {
            dynamicPageType: 'frontastic/quote-detail-page',
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

    // Identify Search
    if (SearchRouter.identifyFrom(request)) {
      return SearchRouter.loadFor(request, context.frontasticContext).then((result: Result) => {
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
      return CategoryRouter.loadPreviewFor(request, context.frontasticContext).then((result: Result) => {
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
      });
    }

    if (CategoryRouter.identifyFrom(request)) {
      return CategoryRouter.loadFor(request, context.frontasticContext).then((result: Result) => {
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
