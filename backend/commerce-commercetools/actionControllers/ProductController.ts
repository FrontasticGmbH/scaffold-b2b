import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { ProductQueryFactory } from '../utils/ProductQueryFactory';
import { ProductQuery } from '@Types/query/ProductQuery';
import { CategoryQuery } from '@Types/query/CategoryQuery';
import { getCurrency, getLocale } from '../utils/Request';
import { ProductApi } from '../apis/ProductApi';
import handleError from '@Commerce-commercetools/utils/handleError';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

export const getProduct: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const productApi = new ProductApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  let productQuery: ProductQuery = {};

  if ('id' in request.query) {
    productQuery = {
      productIds: [request.query['id']],
    };
  }

  if ('sku' in request.query) {
    productQuery = {
      skus: [request.query['sku']],
    };
  }

  try {
    const product = await productApi.getProduct(productQuery);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(product),
      sessionData: request.sessionData,
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const query: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const productApi = new ProductApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  const productQuery = ProductQueryFactory.queryFromParams(request);

  try {
    const queryResult = await productApi.query(productQuery);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(queryResult),
      sessionData: request.sessionData,
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const queryCategories: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const productApi = new ProductApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  const categoryQuery: CategoryQuery = {
    limit: request.query?.limit ?? undefined,
    cursor: request.query?.cursor ?? undefined,
    slug: request.query?.slug ?? undefined,
    parentId: request.query?.parentId ?? undefined,
    format: request.query?.format ?? 'flat',
  };

  try {
    const queryResult = await productApi.queryCategories(categoryQuery);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(queryResult),
      sessionData: request.sessionData,
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const searchableAttributes: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const productApi = new ProductApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  try {
    const result = await productApi.getSearchableAttributes();

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(result),
      sessionData: request.sessionData,
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};
