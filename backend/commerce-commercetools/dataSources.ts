import { DataSourceConfiguration, DataSourceContext } from '@frontastic/extension-types';
import { QuoteQuery } from '@Types/query/QuoteQuery';
import { ProductPaginatedResult } from '@Types/result';
import { Product } from '@Types/product';
import { DataSourcePreviewPayloadElement } from '@frontastic/extension-types/src/ts';
import { ProductQueryFactory } from './utils/ProductQueryFactory';
import { ProductApi } from './apis/ProductApi';
import { getCurrency, getLocale } from './utils/Request';
import { fetchAccountFromSessionEnsureLoggedIn } from '@Commerce-commercetools/utils/fetchAccountFromSession';
import queryParamsToIds from '@Commerce-commercetools/utils/queryParamsToIds';
import queryParamsToStates from '@Commerce-commercetools/utils/queryParamsToState';
import { OrderQueryFactory } from '@Commerce-commercetools/utils/OrderQueryFactory';
import getCartApi from '@Commerce-commercetools/utils/getCartApi';
import getQuoteApi from '@Commerce-commercetools/utils/getQuoteApi';

function productQueryFromContext(context: DataSourceContext, config: DataSourceConfiguration) {
  const productApi = new ProductApi(
    context.frontasticContext,
    context.request ? getLocale(context.request) : null,
    context.request ? getCurrency(context.request) : null,
  );

  const productQuery = ProductQueryFactory.queryFromParams(context?.request, config);
  return { productApi, productQuery };
}

function orderQueryFromContext(context: DataSourceContext, config: DataSourceConfiguration) {
  const account = fetchAccountFromSessionEnsureLoggedIn(context.request);

  const cartApi = getCartApi(context.request, context.frontasticContext);

  const orderQuery = OrderQueryFactory.queryFromParams(context.request, account);

  return { cartApi, orderQuery };
}

function quoteQueryFromContext(context: DataSourceContext, config: DataSourceConfiguration) {
  const account = fetchAccountFromSessionEnsureLoggedIn(context.request);

  const quoteApi = getQuoteApi(context.request, context.frontasticContext);

  const quoteQuery: QuoteQuery = {
    accountId: account.accountId,
    limit: context.request.query?.limit ?? undefined,
    cursor: context.request.query?.cursor ?? undefined,
    quoteIds: queryParamsToIds('quoteIds', context.request.query),
    quoteStates: queryParamsToStates('quoteStates', context.request.query),
    // sortAttributes: queryParamsToSortAttributes(context.request.query),
    query: context.request.query?.query ?? undefined,
  };

  return { quoteApi, quoteQuery };
}

function getPreviewPayload(queryResult: ProductPaginatedResult) {
  return (queryResult.items as Product[]).map((product): DataSourcePreviewPayloadElement => {
    return {
      title: product.name,
      image: product?.variants[0]?.images[0],
    };
  });
}

export default {
  'frontastic/categories': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    const productApi = new ProductApi(
      context.frontasticContext,
      context.request ? getLocale(context.request) : null,
      context.request ? getCurrency(context.request) : null,
    );
    const queryResult = await productApi.queryCategories({});
    return {
      dataSourcePayload: queryResult,
    };
  },

  'frontastic/product-list': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    const { productApi, productQuery } = productQueryFromContext(context, config);

    return await productApi.query(productQuery).then((queryResult) => {
      return {
        dataSourcePayload: queryResult,
        previewPayload: getPreviewPayload(queryResult),
      };
    });
  },

  'frontastic/similar-products': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    const { productApi, productQuery } = productQueryFromContext(context, config);

    return await productApi.query(productQuery).then((queryResult) => {
      return {
        dataSourcePayload: queryResult,
        previewPayload: getPreviewPayload(queryResult),
      };
    });
  },

  'frontastic/product': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    const { productApi, productQuery } = productQueryFromContext(context, config);

    return await productApi.getProduct(productQuery).then((queryResult) => {
      return {
        dataSourcePayload: {
          product: queryResult,
        },
      };
    });
  },

  'frontastic/order': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    const { cartApi, orderQuery } = orderQueryFromContext(context, config);

    return await cartApi.queryOrders(orderQuery).then((queryResult) => {
      return {
        dataSourcePayload: {
          order: queryResult.items[0],
        },
      };
    });
  },

  'frontastic/orders': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    const { cartApi, orderQuery } = orderQueryFromContext(context, config);

    return await cartApi.queryOrders(orderQuery).then((queryResult) => {
      return {
        dataSourcePayload: queryResult,
      };
    });
  },

  'frontastic/quote': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    const { quoteApi, quoteQuery } = quoteQueryFromContext(context, config);

    return await quoteApi.query(quoteQuery).then((queryResult) => {
      return {
        dataSourcePayload: {
          quote: queryResult.items?.[0],
        },
      };
    });
  },

  'frontastic/quotes': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    const { quoteApi, quoteQuery } = quoteQueryFromContext(context, config);

    return await quoteApi.query(quoteQuery).then((queryResult) => {
      return {
        dataSourcePayload: queryResult,
      };
    });
  },

  'frontastic/quote-request': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    const { quoteApi, quoteQuery } = quoteQueryFromContext(context, config);

    return await quoteApi.queryQuoteRequests(quoteQuery).then((queryResult) => {
      return {
        dataSourcePayload: {
          quoteRequest: queryResult.items?.[0],
        },
      };
    });
  },

  'frontastic/quote-requests': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    const { quoteApi, quoteQuery } = quoteQueryFromContext(context, config);

    return await quoteApi.queryQuoteRequests(quoteQuery).then((queryResult) => {
      return {
        dataSourcePayload: queryResult,
      };
    });
  },
};
