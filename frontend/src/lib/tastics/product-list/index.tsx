import React from 'react';
import { redirect } from 'next/navigation';
import { DataSource } from '@/types/lib/datasources';
import { sdk } from '@/sdk';
import { Category } from '@shared/types/product/Category';
import { TasticProps } from '../types';
import { CategoryConfiguration, DataSourceProps, Props } from './types';
import ProductListViewModel from './components/product-list-view-model';

const ProductListTastic = async ({ data, searchParams }: TasticProps<DataSource<DataSourceProps> & Props>) => {
  if (!data.data?.dataSource?.items?.length) return redirect('/404');

  const flatCategoriesResponse = await sdk.composableCommerce.product.queryCategories();
  const categoriesResponse = await sdk.composableCommerce.product.queryCategories({ format: 'tree' });

  const flatCategories = flatCategoriesResponse.isError ? [] : (flatCategoriesResponse.data.items as Category[]);
  const categories = categoriesResponse.isError ? [] : (categoriesResponse.data.items as Category[]);

  const slug = data.data.dataSource?.category?.split('/')?.at(-1) ?? '';

  const category = flatCategories.find((c) => c.slug === slug);
  const treeCategory = categories.find((c) => c.slug === slug);

  const isRootCategory = category?.depth === 0;

  const isSearchPage = !!searchParams.query;

  const sortValueExists = Array.from(Object.keys(searchParams))
    .find((key) => key.startsWith('sortAttributes'))
    ?.match(/sortAttributes\[0\]\[(.+)\]/)?.[1];

  const categoryConfiguration = (data.categoryConfiguration ?? []).reduce(
    (acc, curr) => ({ ...acc, [curr.key]: curr }),
    {} as Record<string, CategoryConfiguration>,
  );

  const isIntermediaryPage = isRootCategory && !searchParams.view && (treeCategory?.subCategories.length ?? 0) >= 3;

  if (!isIntermediaryPage && !sortValueExists) {
    const newSearchParams = new URLSearchParams();

    newSearchParams.set('sortAttributes[0][price]', 'asc');
    newSearchParams.set('view', '1');

    if (isSearchPage) newSearchParams.set('query', searchParams.query as string);

    return redirect(`?${newSearchParams.toString()}`);
  }

  return (
    <ProductListViewModel
      {...data.data.dataSource}
      categoryConfiguration={categoryConfiguration}
      categories={flatCategories}
      category={categories.find((c) => c.slug === slug) ?? category}
      displayIntermediaryPage={isIntermediaryPage && !isSearchPage}
    />
  );
};

export default ProductListTastic;
