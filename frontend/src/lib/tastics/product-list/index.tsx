import React from 'react';
import { redirect } from 'next/navigation';
import { DataSource } from '@/types/lib/datasources';
import { sdk } from '@/sdk';
import { Result } from '@shared/types/product/Result';
import { Category } from '@shared/types/product/Category';
import { TasticProps } from '../types';
import { CategoryConfiguration, DataSourceProps, Props } from './types';
import ProductListViewModel from './components/product-list-view-model';

const ProductListTastic = async ({ data, searchParams }: TasticProps<DataSource<DataSourceProps> & Props>) => {
  if (!data.data?.dataSource?.items?.length) return redirect('/404');

  const flatCategoriesResponse = await sdk.callAction<Result>({
    actionName: 'product/queryCategories',
  });

  const categoriesResponse = await sdk.callAction<Result>({
    actionName: 'product/queryCategories',
    query: { format: 'tree' },
  });

  const flatCategories = flatCategoriesResponse.isError ? [] : (flatCategoriesResponse.data.items as Category[]);
  const categories = categoriesResponse.isError ? [] : (categoriesResponse.data.items as Category[]);

  const slug = data.data.dataSource?.category?.split('/')?.at(-1) ?? '';

  const category = flatCategories.find((c) => c.slug === slug);

  const isRootCategory = category?.depth === 0;

  const sortValueExists = Array.from(Object.keys(searchParams))
    .find((key) => key.startsWith('sortAttributes'))
    ?.match(/sortAttributes\[0\]\[(.+)\]/)?.[1];

  const categoryConfiguration = data.categoryConfiguration.reduce(
    (acc, curr) => ({ ...acc, [curr.key]: curr }),
    {} as Record<string, CategoryConfiguration>,
  );

  if ((!isRootCategory || (isRootCategory && searchParams.view)) && !sortValueExists)
    return redirect('?sortAttributes[0][price]=asc&view=1');

  return (
    <ProductListViewModel
      {...data.data.dataSource}
      categoryConfiguration={categoryConfiguration}
      categories={flatCategories}
      category={categories.find((c) => c.slug === slug) ?? category}
    />
  );
};

export default ProductListTastic;
