import { SDKResponse, ServerOptions } from '@commercetools/frontend-sdk';
import { FilterField, Product } from '@shared/types/product';
import { GetProductQuery, ProductQueryQuery, QueryProductCategoriesQuery } from '../queries/ProductQueries';
import { ProductPaginatedResult, CategoryPaginatedResult } from '@shared/types/result';

type GetProductAction = (
  query: GetProductQuery,
  options?: {
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Product>>;

type ProductQueryAction = (
  query?: ProductQueryQuery,
  options?: {
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<ProductPaginatedResult>>;

type QueryProductCategoriesAction = (
  query?: QueryProductCategoriesQuery,
  options?: {
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<CategoryPaginatedResult>>;

type GetSearchableProductAttributesAction = (options?: {
  serverOptions?: ServerOptions;
}) => Promise<SDKResponse<FilterField[]>>;

export {
  type GetProductAction,
  type ProductQueryAction,
  type QueryProductCategoriesAction,
  type GetSearchableProductAttributesAction,
};
