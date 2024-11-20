import { SDK, ServerOptions } from '@commercetools/frontend-sdk';
import { ComposableCommerceEventsB2B } from '../../types/events/ComposableCommerceEventsB2B';
import {
  GetProductAction,
  GetSearchableProductAttributesAction,
  ProductQueryAction,
  QueryProductCategoriesAction,
} from '../../types/actions/ProductActions';
import { GetProductQuery, ProductQueryQuery, QueryProductCategoriesQuery } from '../../types/queries/ProductQueries';
import { Category, FilterField, Product } from '@shared/types/product';
import { PaginatedResult, ProductPaginatedResult } from '@shared/types/result';

export type ProductActions = {
  getProduct: GetProductAction;
  query: ProductQueryAction;
  queryCategories: QueryProductCategoriesAction;
  getSearchableAttributes: GetSearchableProductAttributesAction;
};

export const getProductActions = (sdk: SDK<ComposableCommerceEventsB2B>): ProductActions => {
  return {
    getProduct: async (
      query: GetProductQuery,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Product>({
        actionName: 'product/getProduct',
        query,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    query: async (
      query?: ProductQueryQuery,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<ProductPaginatedResult>({
        actionName: 'product/query',
        query,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    queryCategories: async (
      query?: QueryProductCategoriesQuery,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<PaginatedResult<Category>>({
        actionName: 'product/queryCategories',
        query,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    getSearchableAttributes: async (
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<FilterField[]>({
        actionName: 'product/searchableAttributes',
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
  };
};
