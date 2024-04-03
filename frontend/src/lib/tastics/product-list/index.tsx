import React from 'react';
import { DataSource } from '@/types/lib/datasources';
import { sdk } from '@/sdk';
import { Category } from '@shared/types/product/Category';
import { TasticProps } from '../types';
import { CategoryConfiguration, DataSourceProps, Props } from './types';
import ProductListClientWrapper from './components/product-list-client-wrapper';

const ProductListTastic = async ({ data, searchParams }: TasticProps<DataSource<DataSourceProps> & Props>) => {
  if (!data.data?.dataSource) return <></>;

  const flatCategoriesResponse = await sdk.composableCommerce.product.queryCategories({ limit: 500 });
  const categoriesResponse = await sdk.composableCommerce.product.queryCategories({ format: 'tree', limit: 500 });

  const flatCategories = flatCategoriesResponse.isError ? [] : (flatCategoriesResponse.data.items as Category[]);
  const categories = categoriesResponse.isError ? [] : (categoriesResponse.data.items as Category[]);

  const slug = data.data.dataSource?.category?.split('/')?.at(-1) ?? '';

  const category = flatCategories.find((c) => c.slug === slug);
  const treeCategory = categories.find((c) => c.slug === slug);

  const isRootCategory = category?.depth === 0;

  const isSearchPage = !!searchParams.query;

  const categoryConfiguration = (data.categoryConfiguration ?? []).reduce(
    (acc, curr) => ({ ...acc, [curr.key]: curr }),
    {} as Record<string, CategoryConfiguration>,
  );

  const isIntermediaryPage =
    data.useIntermediaryCategoryPage &&
    isRootCategory &&
    !searchParams.view &&
    (treeCategory?.subCategories.length ?? 0) >= 3;

  return (
    <ProductListClientWrapper
      {...data.data.dataSource}
      categoryConfiguration={categoryConfiguration}
      categories={flatCategories}
      category={categories.find((c) => c.slug === slug) ?? category}
      displayIntermediaryPage={isIntermediaryPage && !isSearchPage}
    />
  );
};

export default ProductListTastic;
