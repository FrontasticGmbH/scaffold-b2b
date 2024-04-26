import { FacetDefinition } from '@Types/product';
import { Facet } from '@Types/query';
import { FilterTypes } from '@Types/query/Filter';
import { ProductQuery } from '@Types/query/ProductQuery';
import { RangeFilter } from '@Types/query/RangeFilter';
import { TermFilter } from '@Types/query/TermFilter';
import {
  SearchAnyValue,
  SearchExactExpression,
  ProductSearchFacetDistinctValue,
  ProductSearchFacetExpression,
  ProductSearchFacetRangesValue,
  SearchNumberRangeExpression,
  SearchNumberRangeValue,
  SearchOrExpression,
  SearchQuery,
  SearchQueryExpression,
  ProductSearchRequest,
  SearchWildCardExpression,
  _ProductSearchFacetExpression,
} from '@commercetools/platform-sdk';
import { Locale } from '@Commerce-commercetools/interfaces/Locale';

const EXPANDS = [
  'categories[*].ancestors[*]',
  'categories[*].parent',
  'masterVariant.price.discounted.discount',
  'masterVariant.prices[*].discounted.discount',
  'variants[*].price.discounted.discount',
  'variants[*].prices[*].discounted.discount',
];
const LOCALIZED_FULLTEXT_QUERY_FIELDS = ['name', 'description', 'slug', 'searchKeywords'];
const KEYWORD_EXACT_QUERY_FIELDS = ['variants.sku'];

type Writeable<T> = { -readonly [P in keyof T]: Writeable<T[P]> };

type ProductSearchFactoryUtilMethod = (
  commercetoolsProductSearchRequest: ProductSearchRequest,
  productQuery: ProductQuery,
  locale: Locale,
) => ProductSearchRequest;

export class ProductSearchFactory {
  static createCommercetoolsProductSearchRequestFromProductQuery(
    productQuery: ProductQuery,
    facetDefinitions: FacetDefinition[],
    locale: Locale,
    productIdField: string,
  ): ProductSearchRequest {
    let commercetoolsProductSearchRequest = ProductSearchFactory.initializeProductSearchRequestObject(
      productQuery,
      locale,
    );
    commercetoolsProductSearchRequest = this.applyQueryString(commercetoolsProductSearchRequest, productQuery, locale);
    commercetoolsProductSearchRequest = this.applyQueryCategories(
      commercetoolsProductSearchRequest,
      productQuery,
      locale,
    );
    commercetoolsProductSearchRequest = this.applyQueryProductIds(
      commercetoolsProductSearchRequest,
      productQuery,
      productIdField,
    );
    commercetoolsProductSearchRequest = this.applyStore(commercetoolsProductSearchRequest, productQuery, locale);
    commercetoolsProductSearchRequest = this.applyQuerySKUs(commercetoolsProductSearchRequest, productQuery, locale);
    commercetoolsProductSearchRequest = this.applyProductSelections(
      commercetoolsProductSearchRequest,
      productQuery,
      locale,
    );
    commercetoolsProductSearchRequest = this.applyFilters(
      commercetoolsProductSearchRequest,
      productQuery,
      facetDefinitions,
      locale,
    );
    commercetoolsProductSearchRequest = this.applyFacets(
      commercetoolsProductSearchRequest,
      productQuery,
      facetDefinitions,
      locale,
    );
    commercetoolsProductSearchRequest = this.applySortAttributes(
      commercetoolsProductSearchRequest,
      productQuery,
      locale,
    );
    commercetoolsProductSearchRequest = this.rearrangeProductSearchQuery(commercetoolsProductSearchRequest);
    commercetoolsProductSearchRequest = this.applyDefaultQueryIfEmpty(
      commercetoolsProductSearchRequest,
      productQuery,
      locale,
    );
    return commercetoolsProductSearchRequest;
  }

  private static initializeProductSearchRequestObject(
    productQuery: ProductQuery,
    locale: Locale,
  ): ProductSearchRequest {
    const commercetoolsProductSearchRequest: Writeable<ProductSearchRequest> = {
      query: {},
      productProjectionParameters: {
        priceCountry: locale.country,
        priceCurrency: locale.currency,
        expand: EXPANDS,
      },
    };

    commercetoolsProductSearchRequest.limit = +productQuery.limit || 24;
    commercetoolsProductSearchRequest.offset = this.getOffsetFromCursor(productQuery.cursor);

    if (productQuery.storeKey) {
      commercetoolsProductSearchRequest.productProjectionParameters.storeProjection = productQuery.storeKey;
    }

    if (productQuery.distributionChannelId) {
      commercetoolsProductSearchRequest.productProjectionParameters.priceChannel = productQuery.distributionChannelId;
    }
    return commercetoolsProductSearchRequest;
  }

  /**
   * Rearrange the productSearchQuery by removing extra "and" and "or" fields
   *
   * @param {ProductSearchRequest} commercetoolsProductSearchRequest - the original product search request
   * @return {ProductSearchRequest} the rearranged product search request
   */
  private static rearrangeProductSearchQuery(
    commercetoolsProductSearchRequest: ProductSearchRequest,
  ): ProductSearchRequest {
    const { query } = commercetoolsProductSearchRequest;

    // Extract the "or" and "and" fields from the query object for easier access
    const intermediateValues: Record<string, number | SearchQuery[]> = {
      orLength: 0,
      andLength: 0,
      orList: [],
      andList: [],
    };

    if ('or' in query) {
      intermediateValues.orLength = query.or.length || 0;
      intermediateValues.orList = query.or;
    }

    if ('and' in query) {
      intermediateValues.andLength = query.and.length || 0;
      intermediateValues.andList = query.and;
    }

    // If neither "or" nor "and" fields exist or they have a length of 0, an empty query object is returned.
    if (intermediateValues.orLength === 0 && intermediateValues.andLength === 0) {
      return { ...commercetoolsProductSearchRequest, query: {} };
    }

    // If only one "or" and one "and" field, and they have the same field name, the function returns the "or" field.
    if (intermediateValues.orLength === 1 && intermediateValues.andLength === 1) {
      const orField = (intermediateValues.orList[0] as SearchExactExpression).exact?.field;
      const andField = intermediateValues.andList[0].exact?.field || intermediateValues.andList[0].range?.field;

      if (orField === andField) {
        return { ...commercetoolsProductSearchRequest, query: intermediateValues.orList[0] };
      }

      return {
        ...commercetoolsProductSearchRequest,
        query: { or: [intermediateValues.andList[0], intermediateValues.orList[0]] },
      };
    }

    // If there is only one "or" field, the function returns it
    if (intermediateValues.andLength === 0) {
      if (intermediateValues.orLength === 1) {
        return { ...commercetoolsProductSearchRequest, query: intermediateValues.orList[0] };
      }
      return {
        ...commercetoolsProductSearchRequest,
        query: {
          or: intermediateValues.orList,
        },
      };
    }

    // If there is only one "and" field, the function returns it
    if (intermediateValues.orLength === 0) {
      if (intermediateValues.andLength === 1) {
        return { ...commercetoolsProductSearchRequest, query: intermediateValues.andList[0] };
      }
      return {
        ...commercetoolsProductSearchRequest,
        query: {
          and: intermediateValues.andList,
        },
      };
    }

    // If there are multiple "or" or "and" fields
    return commercetoolsProductSearchRequest;
  }

  private static pushToProductSearchAndExpression: (
    commercetoolsProductSearchRequest: Writeable<ProductSearchRequest>,
    expression: SearchQuery | SearchQuery[],
  ) => ProductSearchRequest = (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    expression: SearchQuery | SearchQuery[],
  ) => {
    if ('and' in commercetoolsProductSearchRequest.query) {
      if (Array.isArray(expression)) {
        commercetoolsProductSearchRequest.query.and.push(...expression);
      } else {
        commercetoolsProductSearchRequest.query.and.push(expression);
      }
    } else {
      if (Array.isArray(expression)) {
        (commercetoolsProductSearchRequest.query as Writeable<SearchQuery>) = {
          ...commercetoolsProductSearchRequest.query,
          and: [...expression],
        };
      } else {
        (commercetoolsProductSearchRequest.query as Writeable<SearchQuery>) = {
          ...commercetoolsProductSearchRequest.query,
          and: [expression],
        };
      }
    }
    return commercetoolsProductSearchRequest;
  };

  private static pushToProductSearchOrExpression: (
    commercetoolsProductSearchRequest: Writeable<ProductSearchRequest>,
    expression: SearchQuery | SearchQuery[],
  ) => ProductSearchRequest = (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    expression: SearchQuery | SearchQuery[],
  ) => {
    if ('or' in commercetoolsProductSearchRequest.query) {
      if (Array.isArray(expression)) {
        commercetoolsProductSearchRequest.query.or.push(...expression);
      } else {
        commercetoolsProductSearchRequest.query.or.push(expression);
      }
    } else {
      if (Array.isArray(expression)) {
        (commercetoolsProductSearchRequest.query as Writeable<SearchQuery>) = {
          ...commercetoolsProductSearchRequest.query,
          or: [...expression],
        };
      } else {
        (commercetoolsProductSearchRequest.query as Writeable<SearchQuery>) = {
          ...commercetoolsProductSearchRequest.query,
          or: [expression],
        };
      }
    }
    return commercetoolsProductSearchRequest;
  };

  private static applyQueryString: ProductSearchFactoryUtilMethod = (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    productQuery: ProductQuery,
    locale: Locale,
  ) => {
    if (productQuery.query) {
      const productSearchOrExpression: SearchOrExpression = {
        or: [],
      };
      LOCALIZED_FULLTEXT_QUERY_FIELDS.forEach((field) => {
        const fullTextQuery: SearchWildCardExpression = {
          wildcard: {
            field,
            language: locale.language,
            value: `*${productQuery.query}*`,
            caseInsensitive: true,
          },
        };
        productSearchOrExpression.or.push(fullTextQuery);
      });

      KEYWORD_EXACT_QUERY_FIELDS.forEach((field) => {
        const exactFieldQuery: SearchExactExpression = {
          exact: {
            field,
            value: productQuery.query,
            caseInsensitive: true,
          },
        };
        productSearchOrExpression.or.push(exactFieldQuery);
      });
      commercetoolsProductSearchRequest = this.pushToProductSearchAndExpression(
        commercetoolsProductSearchRequest,
        productSearchOrExpression,
      );
    }
    return commercetoolsProductSearchRequest;
  };

  private static applyDefaultQueryIfEmpty: ProductSearchFactoryUtilMethod = (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    productQuery: ProductQuery,
    locale: Locale,
  ) => {
    const isProductSearchQueryEmpty =
      !commercetoolsProductSearchRequest.query || Object.keys(commercetoolsProductSearchRequest.query).length === 0;

    if (!productQuery.query && isProductSearchQueryEmpty) {
      const productSearchWildCardExpression: SearchWildCardExpression = {
        wildcard: {
          field: 'name',
          language: locale.language,
          value: '*',
        },
      };
      commercetoolsProductSearchRequest = {
        ...commercetoolsProductSearchRequest,
        query: productSearchWildCardExpression,
      };
    }
    return commercetoolsProductSearchRequest;
  };

  private static applyQueryCategories: ProductSearchFactoryUtilMethod = (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    productQuery: ProductQuery,
  ) => {
    if (productQuery.categories?.length) {
      const productSearchExactExpressions: SearchExactExpression[] = [];
      productQuery.categories.forEach((categoryId) => {
        productSearchExactExpressions.push({
          exact: {
            field: 'categoriesSubTree',
            value: categoryId,
          },
        });
      });
      commercetoolsProductSearchRequest = this.pushToProductSearchAndExpression(
        commercetoolsProductSearchRequest,
        productSearchExactExpressions,
      );
    }
    return commercetoolsProductSearchRequest;
  };

  private static applyProductSelections: ProductSearchFactoryUtilMethod = (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    productQuery: ProductQuery,
  ) => {
    if (productQuery.productSelectionIds?.length) {
      if (productQuery.productSelectionIds?.length === 1) {
        commercetoolsProductSearchRequest = this.pushToProductSearchAndExpression(commercetoolsProductSearchRequest, {
          exact: {
            field: 'productSelections',
            value: productQuery.productSelectionIds[0],
          },
        });
      } else {
        const productSearchExactExpressions: SearchExactExpression[] = productQuery.productSelectionIds.map((id) => ({
          exact: {
            field: 'productSelections',
            value: id,
          },
        }));

        commercetoolsProductSearchRequest = this.pushToProductSearchOrExpression(
          commercetoolsProductSearchRequest,
          productSearchExactExpressions,
        );
      }
    }
    return commercetoolsProductSearchRequest;
  };

  private static applyQueryProductIds(
    commercetoolsProductSearchRequest: ProductSearchRequest,
    productQuery: ProductQuery,
    productIdField: string,
  ): ProductSearchRequest {
    if (productQuery.productIds?.length) {
      const productSearchExactExpressions: SearchExactExpression[] = [];

      productQuery.productIds.forEach((productId) => {
        productSearchExactExpressions.push({
          exact: {
            field: productIdField,
            value: productId,
          },
        });
      });
      commercetoolsProductSearchRequest = this.pushToProductSearchOrExpression(
        commercetoolsProductSearchRequest,
        productSearchExactExpressions,
      );
    }
    return commercetoolsProductSearchRequest;
  }

  private static applyStore: ProductSearchFactoryUtilMethod = (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    productQuery: ProductQuery,
  ) => {
    if (productQuery.storeId) {
      commercetoolsProductSearchRequest = this.pushToProductSearchAndExpression(commercetoolsProductSearchRequest, {
        exact: {
          field: 'stores',
          value: productQuery.storeId,
        },
      });
    }
    return commercetoolsProductSearchRequest;
  };

  private static applyQuerySKUs: ProductSearchFactoryUtilMethod = (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    productQuery: ProductQuery,
  ) => {
    if (productQuery.skus?.length) {
      const productSearchExactExpressions: SearchExactExpression[] = [];
      productQuery.skus.forEach((sku) => {
        productSearchExactExpressions.push({
          exact: {
            field: 'variants.sku',
            value: sku,
          },
        });
      });
      commercetoolsProductSearchRequest = this.pushToProductSearchOrExpression(
        commercetoolsProductSearchRequest,
        productSearchExactExpressions,
      );
    }
    return commercetoolsProductSearchRequest;
  };

  private static applyFilters: (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    productQuery: ProductQuery,
    facetDefinitions: FacetDefinition[],
    locale: Locale,
  ) => ProductSearchRequest = (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    productQuery: ProductQuery,
    facetDefinitions: FacetDefinition[],
    locale: Locale,
  ) => {
    if (productQuery.filters?.length) {
      const productSearchExpressions: (SearchExactExpression | SearchNumberRangeExpression)[] = [];
      productQuery.filters.forEach((filter) => {
        switch (filter.type) {
          case FilterTypes.TERM:
            (filter as TermFilter).terms.forEach((term) => {
              const productSearchExactSearchExpression: SearchExactExpression = {
                exact: this.hydrateProductSearchExpressionValue(
                  {
                    field: filter.identifier,
                    value: term,
                  },
                  facetDefinitions,
                  locale,
                ) as SearchAnyValue,
              };
              productSearchExpressions.push(productSearchExactSearchExpression);
            });

            break;
          case FilterTypes.BOOLEAN:
            const productSearchExactSearchExpression: SearchExactExpression = {
              exact: this.hydrateProductSearchExpressionValue(
                {
                  field: filter.identifier,
                  value: (filter as TermFilter).terms[0]?.toString().toLowerCase() === 'true',
                },
                facetDefinitions,
                locale,
              ) as SearchAnyValue,
            };
            productSearchExpressions.push(productSearchExactSearchExpression);
            break;
          case FilterTypes.RANGE:
            const rangeQuery: Writeable<SearchNumberRangeExpression> = {
              range: this.hydrateProductSearchExpressionValue(
                {
                  field: filter.identifier,
                },
                facetDefinitions,
                locale,
              ) as SearchNumberRangeValue,
            };
            if ((filter as RangeFilter).min) {
              rangeQuery.range.gt = (filter as RangeFilter).min;
            }
            if ((filter as RangeFilter).max) {
              rangeQuery.range.lt = (filter as RangeFilter).max;
            }
            productSearchExpressions.push(rangeQuery);
            break;
        }
      });
      commercetoolsProductSearchRequest = this.pushToProductSearchAndExpression(
        commercetoolsProductSearchRequest,
        productSearchExpressions,
      );
    }
    return commercetoolsProductSearchRequest;
  };

  private static applyFacets: (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    productQuery: ProductQuery,
    facetDefinitions: FacetDefinition[],
    locale: Locale,
  ) => ProductSearchRequest = (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    productQuery: ProductQuery,
    facetDefinitions: FacetDefinition[],
    locale: Locale,
  ) => {
    commercetoolsProductSearchRequest = this.applyFacetDefinitionsToFacets(
      commercetoolsProductSearchRequest,
      productQuery,
      facetDefinitions,
      locale,
    );
    return commercetoolsProductSearchRequest;
  };

  private static applySortAttributes: ProductSearchFactoryUtilMethod = (
    commercetoolsProductSearchRequest: Writeable<ProductSearchRequest>,
    productQuery: ProductQuery,
  ) => {
    if (productQuery.sortAttributes) {
      commercetoolsProductSearchRequest.sort = Object.keys(productQuery.sortAttributes).map((key) => ({
        field: key === 'price' ? 'variants.prices.centAmount' : key,
        order: productQuery.sortAttributes[key],
      }));
    }
    return commercetoolsProductSearchRequest;
  };

  private static applyFacetDefinitionsToFacets: (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    productQuery: ProductQuery,
    facetDefinitions: FacetDefinition[],
    locale: Locale,
  ) => ProductSearchRequest = (
    commercetoolsProductSearchRequest: Writeable<ProductSearchRequest>,
    productQuery: ProductQuery,
    facetDefinitions: FacetDefinition[],
    locale: Locale,
  ) => {
    const productSearchFacetExpressions = this.facetDefinitionsToProductSearchFacetExpressions(
      facetDefinitions,
      locale,
    );

    if (productSearchFacetExpressions.length) {
      commercetoolsProductSearchRequest.facets = productSearchFacetExpressions;

      if (productQuery.facets?.length) {
        commercetoolsProductSearchRequest.facets.forEach((searchFacetExpression: _ProductSearchFacetExpression) => {
          const identifier = this.getProductSearchFacetIdentifier(searchFacetExpression);
          const productSearchQueryFilters: SearchQuery[] = [];

          if (identifier) {
            const queryFacet = productQuery.facets.find((f) => f.identifier === identifier);
            if (queryFacet) {
              switch (queryFacet.type) {
                case FilterTypes.TERM:
                  (queryFacet as TermFilter).terms.forEach((term) =>
                    productSearchQueryFilters.push(
                      this.getSearchQueryFilterExpressionFromTermFacet(searchFacetExpression, term, locale),
                    ),
                  );

                  break;
                case FilterTypes.BOOLEAN:
                  productSearchQueryFilters.push(
                    this.getSearchQueryFilterExpressionFromBooleanFacet(searchFacetExpression, queryFacet, locale),
                  );

                  break;
                case FilterTypes.RANGE:
                  productSearchQueryFilters.push(
                    this.getSearchQueryFilterExpressionFromRangeFacet(searchFacetExpression, queryFacet, locale),
                  );

                  break;
              }

              searchFacetExpression = this.pushFiltersIntoProductFacetExpression(
                searchFacetExpression,
                productSearchQueryFilters,
              );
              commercetoolsProductSearchRequest = this.pushToProductSearchAndExpression(
                commercetoolsProductSearchRequest,
                productSearchQueryFilters,
              );
            }
          }
        });
      }
    }

    return commercetoolsProductSearchRequest;
  };

  private static hydrateQueryExpressionWithAttributeType = (
    facet: _ProductSearchFacetExpression,
    query: Writeable<SearchQueryExpression>,
    locale: Locale,
  ): SearchQueryExpression => {
    if ('distinct' in facet) {
      const fieldType = facet.distinct.fieldType;
      if (fieldType) {
        query = {
          ...query,
          fieldType,
        };
        query = this.hydrateQueryExpressionWithLanguage(query, fieldType, locale);
      }
    }
    if ('ranges' in facet) {
      const fieldType = facet.ranges.fieldType;
      if (fieldType) {
        query = {
          ...query,
          fieldType,
        };
        query = this.hydrateQueryExpressionWithLanguage(query, fieldType, locale);
      }
    }
    return query;
  };

  private static hydrateQueryExpressionWithLanguage = (
    query: Writeable<SearchQueryExpression>,
    fieldType: string,
    locale: Locale,
  ): SearchQueryExpression => {
    if (['ltext', 'lenum'].includes(fieldType)) {
      query = {
        ...query,
        language: locale.language,
      };
    }
    return query;
  };

  private static hydrateProductSearchExpressionValue = (
    productSearchExpressionsValue: SearchAnyValue | SearchNumberRangeValue,
    facetDefinitions: FacetDefinition[],
    locale: Locale,
  ): SearchAnyValue | SearchNumberRangeValue => {
    // Only hydrate if the field is an attribute
    if (productSearchExpressionsValue.field.includes('attributes')) {
      const facetDefinition = facetDefinitions.find(
        (facetDefinition) => facetDefinition.attributeId === productSearchExpressionsValue.field,
      );
      if (facetDefinition) {
        const facetValue = this.facetDefinitionToFacetValue(facetDefinition, locale);
        return {
          ...productSearchExpressionsValue,
          ...facetValue,
        };
      }
    }
    return productSearchExpressionsValue;
  };

  private static getFacetSearchExpressionFieldIdentifier = (facet: _ProductSearchFacetExpression): string => {
    if ('distinct' in facet) {
      return facet.distinct.field;
    }
    if ('ranges' in facet) {
      return facet.ranges.field;
    }
    if ('count' in facet) {
      return facet.count.name;
    }
    return '';
  };

  private static facetDefinitionsToProductSearchFacetExpressions = (
    facetDefinitions: FacetDefinition[],
    locale: Locale,
  ): ProductSearchFacetExpression[] => {
    const searchFacetExpressions: ProductSearchFacetExpression[] = [];

    facetDefinitions?.forEach((facetDefinition) => {
      let facet: ProductSearchFacetExpression;
      const facetValue = this.facetDefinitionToFacetValue(facetDefinition, locale);

      switch (facetDefinition.attributeType) {
        case 'enum':
        case 'lenum':
        case 'ltext':
        case 'boolean':
        case 'text':
          facet = {
            distinct: {
              ...facetValue,
              level: 'products',
            },
          };
          break;

        case 'money':
        case 'range':
          facet = {
            ranges: {
              ...facetValue,
              level: 'products',
              ranges: [
                {
                  from: 0,
                },
              ],
            },
          };
          break;

        case 'reference':
        default:
          facet = {
            count: {
              ...facetValue,
              level: 'products',
              scope: 'all',
            },
          };
          break;
      }

      // Alias to identifier used by FE
      searchFacetExpressions.push(facet);
    });

    return searchFacetExpressions;
  };

  private static facetDefinitionToFacetValue = (
    facetDefinition: FacetDefinition,
    locale: Locale,
  ):
    | Pick<ProductSearchFacetDistinctValue, 'name' | 'field' | 'fieldType' | 'language'>
    | Pick<ProductSearchFacetRangesValue, 'name' | 'field' | 'fieldType'> => {
    switch (facetDefinition.attributeType) {
      case 'money':
        return {
          name: `${facetDefinition.attributeId}.centAmount`,
          field: `${facetDefinition.attributeId}.centAmount`,
        };

      case 'enum':
        return {
          name: `${facetDefinition.attributeId}`,
          field: `${facetDefinition.attributeId}.label`,
          fieldType: 'enum',
        };

      case 'lenum':
        return {
          name: `${facetDefinition.attributeId}`,
          field: `${facetDefinition.attributeId}.label`,
          fieldType: 'lenum',
          language: locale.language,
        };

      case 'ltext':
        return {
          name: `${facetDefinition.attributeId}`,
          field: `${facetDefinition.attributeId}`,
          fieldType: 'ltext',
          language: locale.language,
        };

      case 'text':
        return {
          name: `${facetDefinition.attributeId}`,
          field: `${facetDefinition.attributeId}`,
          fieldType: 'text',
        };

      case 'boolean':
        return {
          name: `${facetDefinition.attributeId}`,
          field: `${facetDefinition.attributeId}`,
          fieldType: 'boolean',
        };

      case 'range':
      case 'reference':
      default:
        return {
          name: `${facetDefinition.attributeId}`,
          field: `${facetDefinition.attributeId}`,
        };
    }
  };

  private static pushFiltersIntoProductFacetExpression = (
    facet: Writeable<_ProductSearchFacetExpression>,
    productSearchQueryFilters: SearchQuery[],
  ): ProductSearchFacetExpression => {
    if (!productSearchQueryFilters.length) {
      return facet;
    }

    let filterExpression: SearchQuery = {};

    if (productSearchQueryFilters.length === 1) {
      filterExpression = productSearchQueryFilters[0];
    } else {
      filterExpression = {
        and: productSearchQueryFilters.map((searchQuery) => searchQuery),
      };
    }

    if ('count' in facet) {
      facet.count.filter = filterExpression;
    }
    if ('distinct' in facet) {
      facet.distinct.filter = filterExpression;
    }
    if ('ranges' in facet) {
      facet.ranges.filter = filterExpression;
    }

    return facet;
  };

  private static getOffsetFromCursor = (cursor: string): number => {
    if (cursor === undefined) {
      return undefined;
    }

    const offsetMach = cursor.match(/(?<=offset:).+/);
    return offsetMach !== null ? +Object.values(offsetMach)[0] : undefined;
  };

  private static getSearchQueryFilterExpressionFromRangeFacet(
    searchFacetExpression: _ProductSearchFacetExpression,
    queryFacet: Facet,
    locale: Locale,
  ): SearchNumberRangeExpression {
    const priceQuery: Writeable<SearchNumberRangeExpression> = {
      range: this.hydrateQueryExpressionWithAttributeType(
        searchFacetExpression,
        {
          field: this.getFacetSearchExpressionFieldIdentifier(searchFacetExpression),
        },
        locale,
      ) as SearchNumberRangeValue,
    };
    if ((queryFacet as RangeFilter).min) {
      priceQuery.range.gt = (queryFacet as RangeFilter).min;
    }
    if ((queryFacet as RangeFilter).max) {
      priceQuery.range.lt = (queryFacet as RangeFilter).max;
    }
    return priceQuery;
  }

  private static getSearchQueryFilterExpressionFromBooleanFacet(
    searchFacetExpression: _ProductSearchFacetExpression,
    queryFacet: Facet,
    locale: Locale,
  ): SearchQueryExpression {
    return {
      exact: this.hydrateQueryExpressionWithAttributeType(
        searchFacetExpression,
        {
          field: this.getFacetSearchExpressionFieldIdentifier(searchFacetExpression),
          value: (queryFacet as TermFilter).terms[0]?.toString().toLowerCase() === 'true',
        },
        locale,
      ),
    };
  }

  private static getSearchQueryFilterExpressionFromTermFacet(
    searchFacetExpression: _ProductSearchFacetExpression,
    term: string,
    locale: Locale,
  ): SearchQueryExpression {
    return {
      exact: this.hydrateQueryExpressionWithAttributeType(
        searchFacetExpression,
        {
          field: this.getFacetSearchExpressionFieldIdentifier(searchFacetExpression),
          value: term,
        },
        locale,
      ),
    };
  }

  private static getProductSearchFacetIdentifier(facet: _ProductSearchFacetExpression): string {
    return (
      ('count' in facet && facet.count?.name) ||
      ('distinct' in facet && facet.distinct?.name) ||
      ('ranges' in facet && facet.ranges?.name)
    );
  }
}
