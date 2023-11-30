import { DataSourceConfiguration, DataSourceContext } from '@frontastic/extension-types';
import { getCurrency, getLocale } from './utils/Request';
import { ProductApi } from './apis/ProductApi';
import { ProductQueryFactory } from './utils/ProductQueryFactory';

function productQueryFromContext(context: DataSourceContext, config: DataSourceConfiguration) {
  const productApi = new ProductApi(
    context.frontasticContext,
    context.request ? getLocale(context.request) : null,
    context.request ? getCurrency(context.request) : null,
  );

  const productQuery = ProductQueryFactory.queryFromParams(context?.request, config);
  return { productApi, productQuery };
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
      };
    });
  },

  'frontastic/similar-products': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    const { productApi, productQuery } = productQueryFromContext(context, config);

    return await productApi.query(productQuery).then((queryResult) => {
      return {
        dataSourcePayload: queryResult,
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
};
