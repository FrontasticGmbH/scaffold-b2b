import { Category } from '@Types/product/Category';
import { ProductDiscount, ProductDiscountType, Variant } from '@Types/product/Variant';
import {
  AttributeGroup,
  Category as CommercetoolsCategory,
  CategoryReference,
  ProductVariant as CommercetoolsProductVariant,
  TypedMoney,
} from '@commercetools/platform-sdk';
import { Locale } from '@Commerce-commercetools/interfaces/Locale';
import {
  Attribute as CommercetoolsAttribute,
  FacetResults as CommercetoolsFacetResults,
  ProductProjection as CommercetoolsProductProjection,
  RangeFacetResult as CommercetoolsRangeFacetResult,
  TermFacetResult as CommercetoolsTermFacetResult,
} from '@commercetools/platform-sdk/dist/declarations/src/generated/models/product';
import { Attributes, FacetDefinition, Money, Product } from '@Types/product';
import { ProductRouter } from '@Commerce-commercetools/utils/ProductRouter';
import { ProductDiscount as CommercetoolsProductDiscount } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/product-discount';
import {
  Money as CommercetoolsMoney,
  Price as CommercetoolsPrice,
} from '@commercetools/platform-sdk/dist/declarations/src/generated/models/common';
import {
  AttributeDefinition as CommercetoolsAttributeDefinition,
  AttributeEnumType,
  AttributeLocalizedEnumType,
  AttributeSetType,
  AttributeType,
  ProductType as CommercetoolsProductType,
} from '@commercetools/platform-sdk/dist/declarations/src/generated/models/product-type';
import { FilterField, FilterFieldTypes, FilterFieldValue } from '@Types/product/FilterField';
import {
  Facet as QueryFacet,
  ProductQuery,
  RangeFacet as QueryRangeFacet,
  TermFacet as QueryTermFacet,
} from '@Types/query';
import { RangeFacet as ResultRangeFacet, Term, TermFacet } from '@Types/result';
import { Facet, FacetTypes } from '@Types/result/Facet';
import { FilterTypes } from '@Types/query/Filter';

const TypeMap = new Map<string, string>([
  ['boolean', FilterFieldTypes.BOOLEAN],
  ['enum', FilterFieldTypes.ENUM],
  ['text', FilterFieldTypes.TEXT],
  ['number', FilterFieldTypes.NUMBER],
  ['lenum', FilterFieldTypes.ENUM],
  ['ltext', FilterFieldTypes.TEXT],
]);

export class ProductMapper {
  static commercetoolsProductProjectionToProduct(
    commercetoolsProduct: CommercetoolsProductProjection,
    categoryIdField: string,
    locale: Locale,
  ): Product {
    const product: Product = {
      productId: commercetoolsProduct.id,
      version: commercetoolsProduct?.version?.toString(),
      name: commercetoolsProduct?.name?.[locale.language],
      slug: commercetoolsProduct?.slug?.[locale.language],
      description: commercetoolsProduct?.description?.[locale.language],
      categories: this.commercetoolsCategoryReferencesToCategories(
        commercetoolsProduct.categories,
        categoryIdField,
        locale,
      ),
      variants: this.commercetoolsProductProjectionToVariants(commercetoolsProduct, locale),
    };

    product._url = ProductRouter.generateUrlFor(product);

    return product;
  }

  static commercetoolsProductProjectionToVariants(
    commercetoolsProduct: CommercetoolsProductProjection,
    locale: Locale,
  ): Variant[] {
    const variants: Variant[] = [];

    if (commercetoolsProduct?.masterVariant) {
      variants.push(this.commercetoolsProductVariantToVariant(commercetoolsProduct.masterVariant, locale));
    }

    for (let i = 0; i < commercetoolsProduct.variants.length; i++) {
      variants.push(this.commercetoolsProductVariantToVariant(commercetoolsProduct.variants[i], locale));
    }

    return variants;
  }

  static commercetoolsProductVariantToVariant(
    commercetoolsVariant: CommercetoolsProductVariant,
    locale: Locale,
  ): Variant {
    const attributes = this.commercetoolsAttributesToAttributes(commercetoolsVariant.attributes, locale);
    const { price, discountedPrice, discounts } = this.extractPriceAndDiscounts(commercetoolsVariant, locale);

    return {
      id: commercetoolsVariant.id?.toString(),
      sku: commercetoolsVariant.sku?.toString(),
      images: [
        ...commercetoolsVariant.assets.map((asset) => asset.sources?.[0].uri),
        ...commercetoolsVariant.images.map((image) => image.url),
      ],
      groupId: attributes?.baseId || undefined,
      attributes: attributes,
      price: price,
      discountedPrice: discountedPrice,
      discounts: discounts,
      isOnStock: commercetoolsVariant.availability?.isOnStock || undefined,
      restockableInDays: commercetoolsVariant.availability?.restockableInDays || undefined,
      availableQuantity: commercetoolsVariant.availability?.availableQuantity || undefined,
    } as Variant;
  }

  static commercetoolsAttributesToAttributes(
    commercetoolsAttributes: CommercetoolsAttribute[],
    locale: Locale,
  ): Attributes {
    const attributes: Attributes = {};

    commercetoolsAttributes?.forEach((commercetoolsAttribute) => {
      attributes[commercetoolsAttribute.name] = this.extractAttributeValue(commercetoolsAttribute.value, locale);
    });

    return attributes;
  }

  static commercetoolsCategoryReferencesToCategories(
    commercetoolsCategoryReferences: CategoryReference[],
    categoryIdField: string,
    locale: Locale,
  ): Category[] {
    const categories: Category[] = [];

    commercetoolsCategoryReferences.forEach((commercetoolsCategory) => {
      let category: Category = {
        categoryId: commercetoolsCategory.id,
      } as any;

      if (commercetoolsCategory.obj) {
        category = this.commercetoolsCategoryToCategory(commercetoolsCategory.obj, categoryIdField, locale);
      }

      categories.push(category);
    });

    return categories;
  }

  static commercetoolsProductDiscountValueToProductDiscountValue(
    commercetoolsProductDiscount: CommercetoolsProductDiscount,
    locale: Locale,
  ): ProductDiscount[] {
    const productDiscount: ProductDiscount = {
      description: commercetoolsProductDiscount.description?.[locale.language],
    };

    if (commercetoolsProductDiscount.value.type === ProductDiscountType.RELATIVE) {
      productDiscount.value = commercetoolsProductDiscount.value.permyriad;
      productDiscount.type = ProductDiscountType.RELATIVE;
    }

    if (commercetoolsProductDiscount.value.type === ProductDiscountType.ABSOLUTE) {
      productDiscount.value = commercetoolsProductDiscount.value.money
        .map((money) => {
          return this.commercetoolsMoneyToMoney(money);
        })
        .find((money) => money.currencyCode === locale.currency);
      productDiscount.type = ProductDiscountType.ABSOLUTE;
    }

    return [productDiscount];
  }

  static extractPriceAndDiscounts(commercetoolsVariant: CommercetoolsProductVariant, locale: Locale) {
    let price: Money | undefined;
    let discountedPrice: Money | undefined;
    let discounts: ProductDiscount[] | undefined;

    if (commercetoolsVariant?.scopedPrice) {
      price = this.commercetoolsMoneyToMoney(commercetoolsVariant.scopedPrice?.value);
      if (commercetoolsVariant.scopedPrice?.discounted?.value) {
        discountedPrice = this.commercetoolsMoneyToMoney(commercetoolsVariant.scopedPrice?.discounted?.value);
      }

      if (commercetoolsVariant.scopedPrice?.discounted?.discount?.obj) {
        discounts = this.commercetoolsProductDiscountValueToProductDiscountValue(
          commercetoolsVariant.scopedPrice?.discounted?.discount?.obj,
          locale,
        );
      }

      return { price, discountedPrice, discounts };
    }

    if (commercetoolsVariant?.price) {
      price = this.commercetoolsMoneyToMoney(commercetoolsVariant.price?.value);
      if (commercetoolsVariant.price?.discounted?.value) {
        discountedPrice = this.commercetoolsMoneyToMoney(commercetoolsVariant.price?.discounted?.value);
      }

      if (commercetoolsVariant.price?.discounted?.discount?.obj) {
        discounts = this.commercetoolsProductDiscountValueToProductDiscountValue(
          commercetoolsVariant.price?.discounted?.discount?.obj,
          locale,
        );
      }

      return { price, discountedPrice, discounts };
    }

    if (commercetoolsVariant?.prices) {
      //Filter price by country and currency and if we don't find one, then filter only by currency
      let commercetoolsPrice: CommercetoolsPrice = commercetoolsVariant?.prices.find((price: CommercetoolsPrice) => {
        return (
          !price.hasOwnProperty('channel') &&
          !price.hasOwnProperty('customerGroup') &&
          price.country === locale.country &&
          price.value.currencyCode === locale.currency
        );
      });

      if (!commercetoolsPrice) {
        commercetoolsPrice = commercetoolsVariant?.prices.find((price: CommercetoolsPrice) => {
          return (
            !price.hasOwnProperty('channel') &&
            !price.hasOwnProperty('customerGroup') &&
            !price.hasOwnProperty('country') &&
            price.value.currencyCode === locale.currency
          );
        });
      }

      price = this.commercetoolsMoneyToMoney(commercetoolsPrice?.value);

      if (commercetoolsPrice?.discounted?.value) {
        discountedPrice = this.commercetoolsMoneyToMoney(commercetoolsPrice?.discounted?.value);
      }

      if (commercetoolsPrice?.discounted?.discount?.obj) {
        discounts = this.commercetoolsProductDiscountValueToProductDiscountValue(
          commercetoolsPrice?.discounted?.discount?.obj,
          locale,
        );
      }

      return { price, discountedPrice, discounts };
    }

    return { price, discountedPrice, discounts };
  }

  static commercetoolsMoneyToMoney(commercetoolsMoney: CommercetoolsMoney | TypedMoney): Money | undefined {
    if (commercetoolsMoney === undefined) {
      return undefined;
    }

    return {
      fractionDigits:
        commercetoolsMoney.hasOwnProperty('fractionDigits') &&
        (commercetoolsMoney as TypedMoney).fractionDigits !== undefined
          ? (commercetoolsMoney as TypedMoney).fractionDigits
          : 2,
      centAmount: commercetoolsMoney.centAmount,
      currencyCode: commercetoolsMoney.currencyCode,
    };
  }

  static commercetoolsProductTypesToFilterFields(
    commercetoolsProductTypes: CommercetoolsProductType[],
    locale: Locale,
  ): FilterField[] {
    const filterFields: FilterField[] = [];

    commercetoolsProductTypes?.forEach((productType) => {
      productType.attributes?.forEach((attribute) => {
        if (!attribute.isSearchable) {
          return;
        }

        filterFields.push(this.commercetoolsAttributeDefinitionToFilterField(attribute, locale));
      });
    });

    return filterFields;
  }

  static commercetoolsAttributeDefinitionToFilterField(
    commercetoolsAttributeDefinition: CommercetoolsAttributeDefinition,
    locale: Locale,
  ): FilterField {
    let commercetoolsAttributeType = commercetoolsAttributeDefinition.type.name;

    let commercetoolsAttributeValues = commercetoolsAttributeDefinition.type?.hasOwnProperty('values')
      ? (commercetoolsAttributeDefinition.type as AttributeEnumType | AttributeLocalizedEnumType).values
      : [];

    if (commercetoolsAttributeType === 'set' && commercetoolsAttributeDefinition.type?.hasOwnProperty('elementType')) {
      const elementType: AttributeType = (commercetoolsAttributeDefinition.type as AttributeSetType).elementType;

      commercetoolsAttributeType = elementType.name;
      commercetoolsAttributeValues = elementType?.hasOwnProperty('values')
        ? (elementType as AttributeEnumType | AttributeLocalizedEnumType).values
        : [];
    }

    const filterFieldValues: FilterFieldValue[] = [];

    for (const value of commercetoolsAttributeValues) {
      filterFieldValues.push({
        value: value.key,
        name: value.label?.[locale.language] ?? value.label,
      });
    }

    return {
      field: `variants.attributes.${commercetoolsAttributeDefinition.name}`,
      type: TypeMap.has(commercetoolsAttributeType)
        ? TypeMap.get(commercetoolsAttributeType)
        : commercetoolsAttributeType,
      label: commercetoolsAttributeDefinition.label?.[locale.language] ?? commercetoolsAttributeDefinition.name,
      values: filterFieldValues.length > 0 ? filterFieldValues : undefined,
    };
  }

  static commercetoolsProductTypesToFacetDefinitions(
    commercetoolsProductTypes: CommercetoolsProductType[],
    locale: Locale,
  ): FacetDefinition[] {
    const facetDefinitionsIndex: { [key: string]: FacetDefinition } = {};
    const facetDefinitions: FacetDefinition[] = [];

    commercetoolsProductTypes?.forEach((productType) => {
      productType.attributes?.forEach((attribute) => {
        if (!attribute.isSearchable) {
          return;
        }

        const facetDefinition: FacetDefinition = {
          attributeType: attribute.type.name,
          attributeId: `variants.attributes.${attribute.name}`,
          attributeLabel:
            attribute.label[locale.language] !== undefined && attribute.label[locale.language].length > 0
              ? attribute.label[locale.language]
              : attribute.name,
        };

        facetDefinitionsIndex[facetDefinition.attributeId] = facetDefinition;
      });
    });

    for (const [attributeId, facetDefinition] of Object.entries(facetDefinitionsIndex)) {
      facetDefinitions.push(facetDefinition);
    }

    return facetDefinitions;
  }

  static facetDefinitionsToCommercetoolsQueryArgFacets(facetDefinitions: FacetDefinition[], locale: Locale): string[] {
    const queryArgFacets: string[] = [];

    facetDefinitions?.forEach((facetDefinition) => {
      let facet: string;

      switch (facetDefinition.attributeType) {
        case 'money':
          facet = `${facetDefinition.attributeId}.centAmount:range (0 to *)`;
          break;

        case 'enum':
          facet = `${facetDefinition.attributeId}.label`;
          break;

        case 'lenum':
          facet = `${facetDefinition.attributeId}.label.${locale.language}`;
          break;

        case 'ltext':
          facet = `${facetDefinition.attributeId}.${locale.language}`;
          break;

        case 'number':
        case 'boolean':
        case 'text':
        case 'reference':
        default:
          facet = facetDefinition.attributeId;
          break;
      }

      // Alias to identifier used by us
      queryArgFacets.push(`${facet} as ${facetDefinition.attributeId}`);
    });

    return queryArgFacets;
  }

  static facetDefinitionsToFilterFacets(
    queryFacets: QueryFacet[],
    facetDefinitions: FacetDefinition[],
    locale: Locale,
  ): string[] {
    const filterFacets: string[] = [];
    const typeLookup: { [key: string]: string } = {};

    if (facetDefinitions.length === 0) {
      return filterFacets;
    }

    facetDefinitions.forEach((facetDefinition) => {
      typeLookup[facetDefinition.attributeId] = facetDefinition.attributeType;
    });

    queryFacets.forEach((queryFacet) => {
      if (!typeLookup?.hasOwnProperty(queryFacet.identifier)) {
        return;
      }

      switch (typeLookup[queryFacet.identifier]) {
        case 'money':
          filterFacets.push(
            `${queryFacet.identifier}.centAmount:range (${(queryFacet as QueryRangeFacet).min} to ${
              (queryFacet as QueryRangeFacet).max
            })`,
          );
          break;
        case 'enum':
          filterFacets.push(`${queryFacet.identifier}.label:"${(queryFacet as QueryTermFacet).terms.join('","')}"`);
          break;
        case 'lenum':
          filterFacets.push(
            `${queryFacet.identifier}.label.${locale.language}:"${(queryFacet as QueryTermFacet).terms.join('","')}"`,
          );
          break;
        case 'ltext':
          filterFacets.push(
            `${queryFacet.identifier}.${locale.language}:"${(queryFacet as QueryTermFacet).terms.join('","')}"`,
          );
          break;
        case 'number':
        case 'boolean':
        case 'text':
        case 'reference':
        default:
          if (queryFacet.type === FilterTypes.TERM || queryFacet.type === FilterTypes.BOOLEAN) {
            filterFacets.push(`${queryFacet.identifier}:"${(queryFacet as QueryTermFacet).terms.join('","')}"`);
          } else {
            filterFacets.push(
              `${queryFacet.identifier}:range (${(queryFacet as QueryRangeFacet).min} to ${
                (queryFacet as QueryRangeFacet).max
              })`,
            );
          }
          break;
      }
    });

    return filterFacets;
  }

  static commercetoolsFacetResultsToFacets(
    facetDefinitions: FacetDefinition[],
    commercetoolsFacetResults: CommercetoolsFacetResults,
    productQuery: ProductQuery,
    locale: Locale,
  ): Facet[] {
    const facets: Facet[] = [];
    let facetLabel: string;

    for (const [facetKey, facetResult] of Object.entries(commercetoolsFacetResults)) {
      const facetQuery = this.findFacetQuery(productQuery, facetKey);

      facetDefinitions.filter((facet) => {
        if (facet.attributeId === facetKey) {
          facetLabel = facet.attributeLabel;
        }
      });

      switch (facetResult.type) {
        case 'range':
          facets.push(
            this.commercetoolsRangeFacetResultToRangeFacet(
              facetLabel,
              facetKey,
              facetResult as CommercetoolsRangeFacetResult,
              facetQuery as QueryRangeFacet | undefined,
            ),
          );
          break;

        case 'terms':
          if (facetResult.dataType === 'number') {
            facets.push(
              this.commercetoolsTermNumberFacetResultToRangeFacet(
                facetLabel,
                facetKey,
                facetResult as CommercetoolsTermFacetResult,
                facetQuery as QueryRangeFacet | undefined,
              ),
            );
            break;
          }

          facets.push(
            this.commercetoolsTermFacetResultToTermFacet(
              facetLabel,
              facetKey,
              facetResult as CommercetoolsTermFacetResult,
              facetQuery as QueryTermFacet | undefined,
            ),
          );
          break;
        case 'filter': // Currently, we are not mapping FilteredFacetResult
        default:
          break;
      }
    }

    return facets;
  }

  static commercetoolsRangeFacetResultToRangeFacet(
    facetLabel: string,
    facetKey: string,
    facetResult: CommercetoolsRangeFacetResult,
    facetQuery: QueryRangeFacet | undefined,
  ) {
    const rangeFacet: ResultRangeFacet = {
      type: FacetTypes.RANGE,
      identifier: facetKey,
      label: facetLabel,
      key: facetKey,
      min: facetResult.ranges[0].min,
      max: facetResult.ranges[0].max,
      selected: facetQuery !== undefined,
      minSelected: facetQuery ? facetQuery.min : undefined,
      maxSelected: facetQuery ? facetQuery.max : undefined,
    };

    return rangeFacet;
  }

  static commercetoolsTermFacetResultToTermFacet(
    facetLabel: string,
    facetKey: string,
    facetResult: CommercetoolsTermFacetResult,
    facetQuery: QueryTermFacet | undefined,
  ) {
    const termFacet: TermFacet = {
      type: FacetTypes.TERM,
      identifier: facetKey,
      label: facetLabel,
      key: facetKey,
      selected: facetQuery !== undefined,
      terms: facetResult.terms.map((facetResultTerm) => {
        const term: Term = {
          identifier: facetResultTerm.term.toString(),
          label: facetResultTerm.term.toString(),
          count: facetResultTerm.count,
          key: facetResultTerm.term.toString(),
          selected: facetQuery !== undefined && facetQuery.terms.includes(facetResultTerm.term.toString()),
        };
        return term;
      }),
    };
    return termFacet;
  }

  static commercetoolsTermNumberFacetResultToRangeFacet(
    facetLabel: string,
    facetKey: string,
    facetResult: CommercetoolsTermFacetResult,
    facetQuery: QueryRangeFacet | undefined,
  ) {
    const rangeFacet: ResultRangeFacet = {
      type: FacetTypes.RANGE,
      identifier: facetKey,
      label: facetLabel,
      key: facetKey,
      count: facetResult.total,
      min: Math.min(...facetResult.terms.map((facetResultTerm) => facetResultTerm.term)) ?? Number.MIN_SAFE_INTEGER,
      max: Math.max(...facetResult.terms.map((facetResultTerm) => facetResultTerm.term)) ?? Number.MAX_SAFE_INTEGER,
    };

    if (facetQuery) {
      rangeFacet.selected = true;
      rangeFacet.minSelected = facetQuery.min;
      rangeFacet.maxSelected = facetQuery.max;
    }
    return rangeFacet;
  }

  static commercetoolsAttributeGroupToString(body: AttributeGroup): string[] {
    return body.attributes.map((attribute) => attribute.key);
  }

  static calculatePreviousCursor(offset: number, count: number) {
    return offset - count >= 0 ? `offset:${offset - count}` : undefined;
  }

  static calculateNextCursor(offset: number, count: number, total: number) {
    return offset + count < total ? `offset:${offset + count}` : undefined;
  }

  private static findFacetQuery(productQuery: ProductQuery, facetKey: string) {
    if (productQuery.facets !== undefined) {
      for (const facet of productQuery.facets) {
        if (facet.identifier === facetKey) {
          return facet;
        }
      }
    }

    return undefined;
  }

  static commercetoolsCategoryToCategory: (
    commercetoolsCategory: CommercetoolsCategory,
    categoryIdField: string,
    locale: Locale,
  ) => Category = (commercetoolsCategory: CommercetoolsCategory, categoryIdField: string, locale: Locale) => {
    return {
      categoryId: commercetoolsCategory?.[categoryIdField] ?? commercetoolsCategory.id,
      parentId: commercetoolsCategory.parent?.obj?.[categoryIdField] ?? commercetoolsCategory.parent?.id,
      name: commercetoolsCategory.name?.[locale.language] ?? undefined,
      slug: commercetoolsCategory.slug?.[locale.language] ?? undefined,
      depth: commercetoolsCategory.ancestors.length,
      subCategories:
        (
          commercetoolsCategory as CommercetoolsCategory & { subCategories: CommercetoolsCategory[] }
        ).subCategories?.map((subCategory) =>
          this.commercetoolsCategoryToCategory(subCategory, categoryIdField, locale),
        ) ?? [],
      _url:
        commercetoolsCategory.ancestors.length > 0
          ? `/${commercetoolsCategory.ancestors
              .map((ancestor) => {
                return ancestor?.obj?.slug?.[locale.language];
              })
              .join('/')}/${commercetoolsCategory?.slug?.[locale.language]}`
          : `/${commercetoolsCategory?.slug?.[locale.language]}`,
    };
  };

  static commercetoolsCategoriesToTreeCategory(
    commercetoolsCategories: CommercetoolsCategory[],
    categoryIdField: string,
    locale: Locale,
  ) {
    const nodes = {};

    for (const category of commercetoolsCategories) {
      (category as CommercetoolsCategory & { subCategories: CommercetoolsCategory[] }).subCategories = [];
      nodes[category.id] = category;
    }

    for (const category of commercetoolsCategories) {
      if (!category.parent?.id) continue;

      nodes[category.parent.id].subCategories.push(category);
    }

    return commercetoolsCategories
      .filter((category) => category.ancestors.length === 0)
      .map((category) => this.commercetoolsCategoryToCategory(category, categoryIdField, locale));
  }

  static extractAttributeValue(commercetoolsAttributeValue: unknown, locale: Locale): unknown {
    if (commercetoolsAttributeValue['key'] !== undefined && commercetoolsAttributeValue['label'] !== undefined) {
      return {
        key: commercetoolsAttributeValue['key'],
        label: this.extractAttributeValue(commercetoolsAttributeValue['label'], locale),
      };
    }

    if (commercetoolsAttributeValue instanceof Array) {
      return commercetoolsAttributeValue.map((value) => this.extractAttributeValue(value, locale));
    }

    return commercetoolsAttributeValue[locale.language] || commercetoolsAttributeValue;
  }
}
