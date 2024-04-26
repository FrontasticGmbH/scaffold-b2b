import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { ProductQuery } from '@Types/query/ProductQuery';
import { CategoryQuery, CategoryQueryFormat } from '@Types/query/CategoryQuery';
import { ProductQueryFactory } from '../utils/ProductQueryFactory';
import handleError from '@Commerce-commercetools/utils/handleError';
import getProductApi from '@Commerce-commercetools/utils/apiConstructors/getProductApi';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

export const getProduct: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const productApi = getProductApi(request, actionContext.frontasticContext);

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
  try {
    const productApi = getProductApi(request, actionContext.frontasticContext);

    const productQuery = ProductQueryFactory.queryFromParams(request);

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
  try {
    const productApi = getProductApi(request, actionContext.frontasticContext);

    const categoryQuery: CategoryQuery = {
      limit: request.query?.limit ?? undefined,
      cursor: request.query?.cursor ?? undefined,
      slug: request.query?.slug ?? undefined,
      parentId: request.query?.parentId ?? undefined,
      format: request.query?.format ?? CategoryQueryFormat.FLAT,
    };

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
  try {
    const productApi = getProductApi(request, actionContext.frontasticContext);

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
