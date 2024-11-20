import { DataSourceConfiguration, DataSourceContext, DataSourceRegistry } from '@frontastic/extension-types';
import { QuoteQuery } from '@Types/query/QuoteQuery';
import { ProductPaginatedResult } from '@Types/result';
import { Product } from '@Types/product';
import { DataSourcePreviewPayloadElement } from '@frontastic/extension-types/src/ts';
import { ApprovalFlowsQuery, ApprovalRuleQuery } from '@Types/business-unit';
import { ProductQueryFactory } from './utils/ProductQueryFactory';
import { ValidationError } from './errors/ValidationError';
import { fetchAccountFromSessionEnsureLoggedIn } from '@Commerce-commercetools/utils/fetchAccountFromSession';
import queryParamsToIds from '@Commerce-commercetools/utils/requestHandlers/queryParamsToIds';
import queryParamsToStates from '@Commerce-commercetools/utils/requestHandlers/queryParamsToState';
import { OrderQueryFactory } from '@Commerce-commercetools/utils/OrderQueryFactory';
import getProductApi from '@Commerce-commercetools/utils/apiConstructors/getProductApi';
import handleError from '@Commerce-commercetools/utils/handleError';
import getCartApi from '@Commerce-commercetools/utils/apiConstructors/getCartApi';
import getQuoteApi from '@Commerce-commercetools/utils/apiConstructors/getQuoteApi';
import { assertIsAuthenticated } from '@Commerce-commercetools/utils/assertIsAuthenticated';
import getBusinessUnitApi from '@Commerce-commercetools/utils/apiConstructors/getBusinessUnitApi';
import { getBusinessUnitKey } from '@Commerce-commercetools/utils/requestHandlers/Request';
import ApprovalsQueryFactory from '@Commerce-commercetools/utils/ApprovalsQueryFactory';

function productQueryFromContext(context: DataSourceContext, config: DataSourceConfiguration) {
  const productApi = getProductApi(context.request, context.frontasticContext);

  const productQuery = ProductQueryFactory.queryFromParams(context?.request, config);
  return { productApi, productQuery };
}

function orderQueryFromContext(context: DataSourceContext, config: DataSourceConfiguration) {
  const account = fetchAccountFromSessionEnsureLoggedIn(context.request);

  const cartApi = getCartApi(context.request, context.frontasticContext);

  const orderQuery = OrderQueryFactory.queryFromParams(context.request);

  return { cartApi, orderQuery };
}

function quoteQueryFromContext(context: DataSourceContext) {
  const quoteApi = getQuoteApi(context.request, context.frontasticContext);

  const quoteQuery: QuoteQuery = {
    accountId: context.request.query?.accountId ?? undefined,
    limit: context.request.query?.limit ?? undefined,
    cursor: context.request.query?.cursor ?? undefined,
    quoteIds: queryParamsToIds('quoteIds', context.request.query),
    quoteStates: queryParamsToStates('quoteStates', context.request.query),
    // sortAttributes: queryParamsToSortAttributes(context.request.query),
    query: context.request.query?.query ?? undefined,
  };

  return { quoteApi, quoteQuery };
}

function approvalRuleQueryFromContext(context: DataSourceContext, config: DataSourceConfiguration) {
  const businessUnitApi = getBusinessUnitApi(context.request, context.frontasticContext);

  const approvalRuleQuery: ApprovalRuleQuery = ApprovalsQueryFactory.queryFromParams(
    context.request,
    'approvalRuleIds',
    config,
  );

  return { businessUnitApi, approvalRuleQuery };
}

function approvalFlowQueryFromContext(context: DataSourceContext, config: DataSourceConfiguration) {
  const businessUnitApi = getBusinessUnitApi(context.request, context.frontasticContext);

  const approvalFlowQuery: ApprovalFlowsQuery = ApprovalsQueryFactory.queryFromParams(
    context.request,
    'approvalFlowIds',
    config,
  );

  return { businessUnitApi, approvalFlowQuery };
}

function getPreviewPayload(queryResult: ProductPaginatedResult) {
  return (queryResult.items as Product[]).map((product): DataSourcePreviewPayloadElement => {
    return {
      title: product.name,
      image: product?.variants[0]?.images[0],
    };
  });
}

// Master data source is only available in the context of a dynamic page
const findDynamicPageMasterDataSource = (context: DataSourceContext, dataSourceType: string) => {
  // Since the DataSourceConfiguration doesn't return the streamId, we need to access the private property directly.
  // This needs to be refactored once the dataSourceId is returned in the DataSourceConfiguration.
  return context.pageFolder.dataSourceConfigurations.find(
    (dataSource) => (dataSource as any).streamId === '__master' && dataSource.type === dataSourceType,
  );
};

const dataSources: DataSourceRegistry = {
  'frontastic/categories': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    try {
      const { productApi } = productQueryFromContext(context, config);

      const queryResult = await productApi.queryCategories({});

      return {
        dataSourcePayload: queryResult,
      };
    } catch (error) {
      return {
        dataSourcePayload: handleError(error, context.request),
      };
    }
  },

  'frontastic/product-list': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    try {
      const { productApi, productQuery } = productQueryFromContext(context, config);

      const queryResult = await productApi.query(productQuery);

      return {
        dataSourcePayload: queryResult,
        previewPayload: getPreviewPayload(queryResult),
      };
    } catch (error) {
      return {
        dataSourcePayload: handleError(error, context.request),
      };
    }
  },

  'frontastic/similar-products': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    try {
      const { productApi, productQuery } = productQueryFromContext(context, config);

      const queryResult = await productApi.query(productQuery);

      return {
        dataSourcePayload: queryResult,
        previewPayload: getPreviewPayload(queryResult),
      };
    } catch (error) {
      return {
        dataSourcePayload: handleError(error, context.request),
      };
    }
  },

  'frontastic/product': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    try {
      const { productApi, productQuery } = productQueryFromContext(context, config);

      const queryResult = await productApi.getProduct(productQuery);

      return {
        dataSourcePayload: {
          product: queryResult,
        },
      };
    } catch (error) {
      return {
        dataSourcePayload: handleError(error, context.request),
      };
    }
  },

  'frontastic/referenced-products': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    try {
      if (!context.hasOwnProperty('request')) {
        throw new ValidationError({
          message: `Request is not defined in context ${context}`,
        });
      }

      const masterDataSource = findDynamicPageMasterDataSource(context, 'frontastic/product');

      const referencedProductsIdField = config?.configuration?.referencedProductsIdField;

      if (!masterDataSource || !referencedProductsIdField) {
        return {
          dataSourcePayload: {},
          previewPayload: [],
        };
      }

      // Since the DataSourceConfiguration doesn't return the preloadedValue, we need to access the private property directly.
      // This needs to be refactored once the preloadedValue is returned in the DataSourceConfiguration.
      const masterProduct = (masterDataSource as any)?.preloadedValue?.product as Product;

      const masterProductReferencedProductIds = masterProduct.variants?.[0]?.attributes?.[referencedProductsIdField];

      context.request.query['productIds'] = masterProductReferencedProductIds || [];

      const { productApi, productQuery } = productQueryFromContext(context, config);

      const queryResult = await productApi.query(productQuery);

      return !context.isPreview
        ? { dataSourcePayload: queryResult }
        : {
            dataSourcePayload: queryResult,
            previewPayload: getPreviewPayload(queryResult),
          };
    } catch (error) {
      return {
        dataSourcePayload: handleError(error, context.request),
      };
    }
  },

  'frontastic/order': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    try {
      assertIsAuthenticated(context.request);

      const { cartApi, orderQuery } = orderQueryFromContext(context, config);

      const queryResult = await cartApi.queryOrders(orderQuery);

      return {
        dataSourcePayload: {
          order: queryResult.items[0],
        },
      };
    } catch (error) {
      return {
        dataSourcePayload: handleError(error, context.request),
      };
    }
  },

  'frontastic/orders': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    try {
      assertIsAuthenticated(context.request);

      const { cartApi, orderQuery } = orderQueryFromContext(context, config);

      const queryResult = await cartApi.queryOrders(orderQuery);

      return {
        dataSourcePayload: queryResult,
      };
    } catch (error) {
      return {
        dataSourcePayload: handleError(error, context.request),
      };
    }
  },

  'frontastic/approval-flow': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    try {
      const account = assertIsAuthenticated(context.request);
      const businessUnitKey = getBusinessUnitKey(context.request);

      const { businessUnitApi, approvalFlowQuery } = approvalFlowQueryFromContext(context, config);

      const queryResult = await businessUnitApi.queryApprovalFlows(
        account.accountId,
        businessUnitKey,
        approvalFlowQuery,
      );

      return {
        dataSourcePayload: {
          approvalFlow: queryResult.items?.[0],
        },
      };
    } catch (error) {
      return {
        dataSourcePayload: handleError(error, context.request),
      };
    }
  },

  'frontastic/approval-rule': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    try {
      const account = assertIsAuthenticated(context.request);
      const businessUnitKey = getBusinessUnitKey(context.request);
      const { businessUnitApi, approvalRuleQuery } = approvalRuleQueryFromContext(context, config);

      const queryResult = await businessUnitApi.queryApprovalRules(
        account.accountId,
        businessUnitKey,
        approvalRuleQuery,
      );

      return {
        dataSourcePayload: {
          approvalRule: queryResult.items?.[0],
        },
      };
    } catch (error) {
      return {
        dataSourcePayload: handleError(error, context.request),
      };
    }
  },

  'frontastic/approval-flows': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    try {
      const account = assertIsAuthenticated(context.request);
      const businessUnitKey = getBusinessUnitKey(context.request);

      const { businessUnitApi, approvalFlowQuery } = approvalFlowQueryFromContext(context, config);

      const queryResult = await businessUnitApi.queryApprovalFlows(
        account.accountId,
        businessUnitKey,
        approvalFlowQuery,
      );

      return {
        dataSourcePayload: queryResult,
      };
    } catch (error) {
      return {
        dataSourcePayload: handleError(error, context.request),
      };
    }
  },

  'frontastic/approval-rules': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    try {
      const account = assertIsAuthenticated(context.request);
      const businessUnitKey = getBusinessUnitKey(context.request);

      const { businessUnitApi, approvalFlowQuery } = approvalFlowQueryFromContext(context, config);

      const queryResult = await businessUnitApi.queryApprovalRules(
        account.accountId,
        businessUnitKey,
        approvalFlowQuery,
      );

      return {
        dataSourcePayload: queryResult,
      };
    } catch (error) {
      return {
        dataSourcePayload: handleError(error, context.request),
      };
    }
  },

  'frontastic/quote': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    try {
      const { quoteApi, quoteQuery } = quoteQueryFromContext(context);

      const queryResult = await quoteApi.query(quoteQuery);

      return {
        dataSourcePayload: {
          quote: queryResult.items?.[0],
        },
      };
    } catch (error) {
      return {
        dataSourcePayload: handleError(error, context.request),
      };
    }
  },

  'frontastic/quotes': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    try {
      const { quoteApi, quoteQuery } = quoteQueryFromContext(context);

      const queryResult = await quoteApi.query(quoteQuery);

      return {
        dataSourcePayload: queryResult,
      };
    } catch (error) {
      return {
        dataSourcePayload: handleError(error, context.request),
      };
    }
  },

  'frontastic/quote-request': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    try {
      const { quoteApi, quoteQuery } = quoteQueryFromContext(context);

      const queryResult = await quoteApi.queryQuoteRequests(quoteQuery);

      return {
        dataSourcePayload: {
          quoteRequest: queryResult.items?.[0],
        },
      };
    } catch (error) {
      return {
        dataSourcePayload: handleError(error, context.request),
      };
    }
  },

  'frontastic/quote-requests': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    try {
      const { quoteApi, quoteQuery } = quoteQueryFromContext(context);

      const queryResult = await quoteApi.queryQuoteRequests(quoteQuery);

      return {
        dataSourcePayload: queryResult,
      };
    } catch (error) {
      return {
        dataSourcePayload: handleError(error, context.request),
      };
    }
  },
};

export default dataSources;
