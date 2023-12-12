import React from 'react';
import { redirect } from 'next/navigation';
import { DataSource } from '@/types/lib/datasources';
import { sdk } from '@/sdk';
import { Result } from '@shared/types/product/Result';
import { Category } from '@shared/types/product/Category';
import { TasticProps } from '../types';
import { DataSourceProps } from './types';
import ProductListViewModel from './components/product-list-view-model';

const ProductListTastic = async ({ data, searchParams }: TasticProps<DataSource<DataSourceProps>>) => {
  if (!data.data?.dataSource?.items?.length) return redirect('/404');

  const sortValueExists = Array.from(Object.keys(searchParams))
    .find((key) => key.startsWith('sortAttributes'))
    ?.match(/sortAttributes\[0\]\[(.+)\]/)?.[1];

  if (!sortValueExists) return redirect('?sortAttributes[0][price]=asc');

  const categoriesResponse = await sdk.callAction<Result>({ actionName: 'product/queryCategories' });

  return (
    <ProductListViewModel
      {...data.data.dataSource}
      categories={categoriesResponse.isError ? [] : (categoriesResponse.data.items as Category[])}
    />
  );
};

export default ProductListTastic;
