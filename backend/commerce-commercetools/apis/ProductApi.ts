import { Category } from '@Types/product/Category';
import { FacetDefinition } from '@Types/product/FacetDefinition';
import { FilterField, FilterFieldTypes } from '@Types/product/FilterField';
import { Product } from '@Types/product/Product';
import { Filter, TermFilter } from '@Types/query';
import { CategoryQuery, CategoryQueryFormat } from '@Types/query/CategoryQuery';
import { ProductQuery } from '@Types/query/ProductQuery';
import { PaginatedResult, ProductPaginatedResult } from '@Types/result';
import {
  ProductSearchFacetResult,
  ProductSearchFacetResultBucket,
  ProductSearchRequest,
} from '@commercetools/platform-sdk';
import { Store } from '@Types/store/Store';
import { Context, Request } from '@frontastic/extension-types';
import ProductMapper from '../mappers/ProductMapper';
import { ProductSearchFactory } from '@Commerce-commercetools/utils/ProductSearchQueryFactory';
import { ExternalError } from '@Commerce-commercetools/errors/ExternalError';
import BaseApi from '@Commerce-commercetools/apis/BaseApi';
import getProjectApi from '@Commerce-commercetools/utils/apiFactories/getProjectApi';

export default class ProductApi extends BaseApi {
  protected request: Request;

  constructor(context: Context, locale: string | null, currency: string | null, request?: Request | null) {
    super(context, locale, currency, request);
    this.request = request;
  }

  async query(productQuery: ProductQuery): Promise<ProductPaginatedResult> {
    const locale = await this.getCommercetoolsLocal();
    const defaultLocale = await this.getCommercetoolsDefaultLocal();
    productQuery.categories = await this.hydrateCategories(productQuery);
    productQuery.filters = await this.hydrateFilters(productQuery);
    productQuery.store = await this.hydrateStore(productQuery);

    const facetDefinitions: FacetDefinition[] = [
      ...ProductMapper.commercetoolsProductTypesToFacetDefinitions(
        await this.getCommercetoolsProductTypes(),
        locale,
        defaultLocale,
      ),
      // Include Price facet
      {
        attributeId: 'variants.prices',
        attributeType: 'money',
      },
    ];

    const commercetoolsProductSearchRequest =
      ProductSearchFactory.createCommercetoolsProductSearchRequestFromProductQuery(
        productQuery,
        facetDefinitions,
        locale,
        this.productIdField,
      );

    return this.requestBuilder()
      .products()
      .search()
      .post({
        body: commercetoolsProductSearchRequest,
      })
      .execute()
      .then((response) => {
        const items = response.body.results.map((product) =>
          ProductMapper.commercetoolsProductSearchResultToProduct(
            product,
            this.productIdField,
            this.categoryIdField,
            locale,
            defaultLocale,
            productQuery.supplyChannelId,
            productQuery.distributionChannelId,
            productQuery.accountGroupIds,
          ),
        );
        const count = response.body.results.length;
        const result: ProductPaginatedResult = {
          total: response.body.total,
          items,
          count,
          facets: ProductMapper.commercetoolsFacetResultsToFacets(
            response.body.facets,
            commercetoolsProductSearchRequest,
            facetDefinitions,
            productQuery,
          ),
          previousCursor: ProductMapper.calculatePreviousCursor(response.body.offset, count),
          nextCursor: ProductMapper.calculateNextCursor(response.body.offset, count, response.body.total),
          query: productQuery,
        };

        return result;
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async getProduct(productQuery: ProductQuery): Promise<Product> {
    try {
      const result = await this.query(productQuery);

      return result.items.shift() as Product;
    } catch (error) {
      throw error;
    }
  }

  async getSearchableAttributes(): Promise<FilterField[]> {
    const locale = await this.getCommercetoolsLocal();
    const defaultLocale = await this.getCommercetoolsDefaultLocal();

    const response = await this.requestBuilder()
      .productTypes()
      .get()
      .execute()
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });

    const filterFields = ProductMapper.commercetoolsProductTypesToFilterFields(
      response.body.results,
      locale,
      defaultLocale,
    );

    // Category filter. Not included as commercetools product type.
    filterFields.push({
      field: 'categoryIds',
      type: FilterFieldTypes.ENUM,
      label: 'Category',
      values: await this.queryCategories({ limit: 250 }).then((result) => {
        return (result.items as Category[]).map((item) => {
          return {
            value: item.categoryId,
            name: item.name,
          };
        });
      }),
    });

    // Variants scoped price filter. Not included as commercetools product type.
    filterFields.push({
      field: 'variants.prices',
      type: FilterFieldTypes.MONEY,
      label: 'Variants scoped price', // TODO: localize label
    });

    return filterFields;
  }

  async getProductFilters(): Promise<FilterField[]> {
    const locale = await this.getCommercetoolsLocal();
    const defaultLocale = await this.getCommercetoolsDefaultLocal();

    const commercetoolsProductTypes = await this.getCommercetoolsProductTypes();

    const filterFields: FilterField[] = [];

    // Product type filter
    filterFields.push({
      field: 'productTypeId',
      type: FilterFieldTypes.ENUM,
      label: 'Product type',
      values: commercetoolsProductTypes.map((item) => {
        return {
          value: item.id,
          name: item.name,
        };
      }),
    });

    // Variants price filter. Not included as commercetools product type.
    filterFields.push({
      field: 'variants.prices',
      type: FilterFieldTypes.MONEY,
      label: 'Variants price',
    });

    // Searchable attributes filter
    filterFields.push(
      ...ProductMapper.commercetoolsProductTypesToFilterFields(commercetoolsProductTypes, locale, defaultLocale),
    );

    filterFields.push(...(await this.getCategoryFilters()));

    return filterFields;
  }

  async getCategoryFilters(): Promise<FilterField[]> {
    return [
      {
        field: 'categoryRef',
        type: FilterFieldTypes.ENUM,
        label: 'Category',
        values: await this.queryCategories({ limit: 250 }).then((result) => {
          return result.items.map((item) => {
            return {
              value: item.categoryRef,
              name: item.name,
            };
          });
        }),
      },
    ];
  }

  async queryCategories(categoryQuery: CategoryQuery): Promise<PaginatedResult<Category>> {
    const locale = await this.getCommercetoolsLocal();
    const defaultLocale = await this.getCommercetoolsDefaultLocal();

    const limit = +categoryQuery.limit || 24;
    const where: string[] = [];

    if (categoryQuery.slug) {
      where.push(`slug(${locale.language}="${categoryQuery.slug}")`);
    }

    if (categoryQuery.parentId) {
      where.push(`parent(id="${categoryQuery.parentId}")`);
    }

    // Some categories are only available for a specific store. If the storeKey is provided,
    // we need to filter the categories by store.
    if (categoryQuery.storeKey) {
      const store = await getProjectApi(this.request, this.commercetoolsFrontendContext).getStoreByKey(
        categoryQuery.storeKey,
      );

      const storeCategoryIds = await this.getCategoryIdsForStore(store.storeId);

      if (storeCategoryIds?.length) {
        where.push(`id in ("${storeCategoryIds.join('","')}")`);
      }
    }

    const methodArgs = {
      queryArgs: {
        limit: limit,
        offset: this.getOffsetFromCursor(categoryQuery.cursor),
        where: where.length > 0 ? where : undefined,
        expand: ['ancestors[*]', 'parent'],
        sort: 'orderHint',
      },
    };

    return await this.getCommercetoolsCategoryPagedQueryResponse(methodArgs)
      .then((response) => {
        const items =
          categoryQuery.format === CategoryQueryFormat.TREE
            ? ProductMapper.commercetoolsCategoriesToTreeCategory(response.body.results, this.categoryIdField, locale)
            : response.body.results.map((category) =>
                ProductMapper.commercetoolsCategoryToCategory(category, this.categoryIdField, locale, defaultLocale),
              );

        const result: PaginatedResult<Category> = {
          total: response.body.total,
          items: items,
          count: response.body.count,
          previousCursor: ProductMapper.calculatePreviousCursor(response.body.offset, response.body.count),
          nextCursor: ProductMapper.calculateNextCursor(response.body.offset, response.body.count, response.body.total),
          query: categoryQuery,
        };

        return result;
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  protected getOffsetFromCursor(cursor: string): number | undefined {
    if (cursor === undefined) {
      return undefined;
    }

    const offsetMach = cursor.match(/(?<=offset:).+/);
    return offsetMach !== null ? +Object.values(offsetMach)[0] : undefined;
  }

  protected async hydrateCategories(productQuery: ProductQuery): Promise<string[]> {
    if (productQuery.categories !== undefined && productQuery.categories.length !== 0) {
      let categoryIds = productQuery.categories.filter(function uniqueCategories(value, index, self) {
        return self.indexOf(value) === index;
      });

      // commercetools only allows filter categories by id. If we are using something different as categoryIdField,
      // we need first to fetch the category to get the correspondent category id.
      if (this.categoryIdField !== 'id') {
        const categoriesMethodArgs = {
          queryArgs: {
            where: [`key in ("${categoryIds.join('","')}")`],
          },
        };

        categoryIds = await this.getCommercetoolsCategoryPagedQueryResponse(categoriesMethodArgs).then((response) => {
          return response.body.results.map((category) => {
            return category.id;
          });
        });
      }

      return categoryIds;
    }
    return [];
  }

  protected async hydrateStore(productQuery: ProductQuery): Promise<Store | undefined> {
    const projectApi = getProjectApi(this.request, this.commercetoolsFrontendContext);

    // We give priority to storeRef as this is set by the seller in Studio
    if (productQuery.storeRef) {
      switch (this.storeRefField) {
        case 'key':
          return await projectApi.getStoreByKey(productQuery.storeRef);
        case 'id':
          return await projectApi.getStoreById(productQuery.storeRef);
        default:
          break;
      }
    }

    if (productQuery?.store?.key) {
      return await projectApi.getStoreByKey(productQuery.store.key);
    }

    return undefined;
  }

  protected async hydrateFilters(productQuery: ProductQuery): Promise<Filter[]> {
    if (productQuery.filters !== undefined && productQuery.filters.length !== 0) {
      const categoryIds = productQuery.filters
        .filter((filter) => filter.identifier === 'categoriesSubTree')
        .map((filter) => (filter as TermFilter).terms?.map((term) => term))
        .filter(function uniqueCategories(value, index, self) {
          return self.indexOf(value) === index;
        });

      // commercetools only allows filter categories by id. If we are using something different as categoryIdField,
      // we need first to fetch the category to get the correspondent category id.
      if (this.categoryIdField !== 'id' && categoryIds.length !== 0) {
        const categoriesMethodArgs = {
          queryArgs: {
            where: [`key in ("${categoryIds.join('","')}")`],
          },
        };

        const categories = await this.getCommercetoolsCategoryPagedQueryResponse(categoriesMethodArgs).then(
          (response) => {
            return response.body.results;
          },
        );

        productQuery.filters = productQuery.filters.map((filter) => {
          if (filter.identifier === 'categoriesSubTree') {
            return {
              ...filter,
              terms: categories
                ?.filter((category) => (filter as TermFilter).terms?.includes(category.key))
                ?.map((category) => category.id),
            };
          }
          return filter;
        });
      }

      return productQuery.filters;
    }
    return [];
  }

  protected async getCategoryIdsForStore(storeId: string): Promise<string[] | undefined> {
    const productSearchRequest: ProductSearchRequest = {
      query: {
        exact: {
          field: 'stores',
          value: storeId, // CoCo uses IDs to filter products by store
        },
      },
      facets: [
        {
          distinct: {
            name: 'categoriesSubTree',
            field: 'categoriesSubTree',
            level: 'products',
            limit: 200,
          },
        },
      ],
    };

    return await this.requestBuilder()
      .products()
      .search()
      .post({
        body: productSearchRequest,
      })
      .execute()
      .then((response) => {
        const categoriesSubTreeFacet = response.body.facets?.find(
          (facetResult: ProductSearchFacetResult) => facetResult.name === 'categoriesSubTree',
        ) as ProductSearchFacetResultBucket;

        if (!categoriesSubTreeFacet?.buckets) {
          return undefined;
        }

        return categoriesSubTreeFacet.buckets.filter((bucket) => bucket.count > 0).map((bucket) => bucket.key);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  protected async getCommercetoolsCategoryPagedQueryResponse(methodArgs: object) {
    return await this.requestBuilder()
      .categories()
      .get(methodArgs)
      .execute()
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  protected async getCommercetoolsProductSelectionPagedQueryResponse(methodArgs: object) {
    return await this.requestBuilder()
      .productSelections()
      .get(methodArgs)
      .execute()
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }
}
