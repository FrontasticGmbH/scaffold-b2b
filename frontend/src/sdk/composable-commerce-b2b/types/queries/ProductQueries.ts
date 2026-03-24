import { CategoryQuery, ProductQuery } from '@shared/types/query';

type GetProductQuery = {
  id?: string;
  key?: string;
  ref?: string;
  sku?: string;
};

type ProductQueryQuery = {
  limit?: number;
  cursor?: string;
  categories?: string[];
  productIds?: string[];
  productKeys?: string[];
  productRefs?: string[];
  productType?: string;
  skus?: string[];
  query?: string;
  storeKey?: string;
  distributionChannelId?: string;
  supplyChannelId?: string;
  productSelectionIds?: string[];
};

type QueryProductCategoriesQuery = {
  limit?: number;
  cursor?: string;
  parentId?: string;
  slug?: string;
  format?: string;
};

export { type GetProductQuery, type ProductQueryQuery, type QueryProductCategoriesQuery };
