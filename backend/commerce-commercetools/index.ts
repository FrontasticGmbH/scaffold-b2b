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
import { ApprovalFlow, ApprovalRule } from '@Types/business-unit';
import { Attributes } from '@Types/product/Attributes';
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
import ApprovalRouter from '@Commerce-commercetools/utils/routers/ApprovalRouter';

const extensionRegistry: ExtensionRegistry = {
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

      // Identify Order
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

      // Identify Orders
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

      // Identify Quote
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

      // Identify Quote Request
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

      // Identify Quotes
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

      // Identify Quotes
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

      // Identify Approval Flow
      if (ApprovalRouter.identifyApprovalFlowFrom(request)) {
        const approvalFlow: ApprovalFlow = await ApprovalRouter.loadApprovalFlowFor(request, context.frontasticContext);

        if (approvalFlow) {
          return {
            dynamicPageType: 'frontastic/approval-flow-page',
            dataSourcePayload: approvalFlow,
            pageMatchingPayload: approvalFlow,
          };
        }
        return null;
      }

      // Identify Approval Rule
      if (ApprovalRouter.identifyApprovalRuleFrom(request)) {
        const approvalRule: ApprovalRule = await ApprovalRouter.loadApprovalRuleFor(request, context.frontasticContext);

        if (approvalRule) {
          return {
            dynamicPageType: 'frontastic/approval-rule-page',
            dataSourcePayload: approvalRule,
            pageMatchingPayload: approvalRule,
          };
        }
        return null;
      }

      // Identify Approval Flows
      if (ApprovalRouter.identifyApprovalFlowsFrom(request)) {
        const result = await ApprovalRouter.loadApprovalFlowsFor(request, context.frontasticContext);

        if (result) {
          return {
            dynamicPageType: 'frontastic/approval-flows-page',
            dataSourcePayload: result,
            pageMatchingPayload: result,
          };
        }
        return null;
      }

      // Identify Approval Rules
      if (ApprovalRouter.identifyApprovalRulesFrom(request)) {
        const result = await ApprovalRouter.loadApprovalRulesFor(request, context.frontasticContext);

        if (result) {
          return {
            dynamicPageType: 'frontastic/approval-rules-page',
            dataSourcePayload: result,
            pageMatchingPayload: result,
          };
        }
        return null;
      }

      // Identify Product
      if (ProductRouter.identifyFrom(request)) {
        return ProductRouter.loadFor(request, context.frontasticContext).then((product: Product) => {
          if (!product) {
            return null;
          }

          const sku = ProductRouter.skuFromUrl(request);
          const matchingAttributes: Attributes = {};

          if (sku) {
            const selectedVariant = product.variants.find((variant) => variant.sku === sku);

            if (selectedVariant.attributes) {
              Object.entries(selectedVariant.attributes).forEach(([key, value]) => {
                // FECL can't match rules on arrays, so we ignore array attributes
                if (!Array.isArray(value)) {
                  matchingAttributes[key] = value?.key ?? value;
                }
              });
            }
          }

          return {
            dynamicPageType: 'frontastic/product-page',
            dataSourcePayload: {
              product: product,
            },
            pageMatchingPayload: {
              productTypeId: product.productTypeId || '',
              variants: {
                attributes: matchingAttributes,
              },
              categoryRef: product.categories?.map((category) => category.categoryRef),
            },
          };
        });
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

      // Identify Category
      if (CategoryRouter.identifyFrom(request)) {
        return CategoryRouter.loadFor(request, context.frontasticContext).then((category) => {
          if (!category) {
            return null;
          }

          return CategoryRouter.loadProductsFor(request, context.frontasticContext, category).then((result) => {
            if (!result) {
              return null;
            }

            return {
              dynamicPageType: 'frontastic/category',
              dataSourcePayload: result,
              pageMatchingPayload: {
                categoryRef: category.categoryRef,
                isMainCategory: category.parentId === undefined,
              },
            };
          });
        });
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
};
export default extensionRegistry;
