import React from 'react';
import { DataSource } from '@/types/lib/datasources';
import { Product } from '@shared/types/product';
import { TasticProps } from '../types';
import { CategoryConfiguration, DataSourceProps, Props } from './types';
import ProductListClientWrapper from './components/product-list-client-wrapper';

const filterMatchingVariants = (items: Product[]) => {
  return items.map((item) => ({
    ...item,
    variants: item.variants.filter((variant) => variant.isMatchingVariant !== false),
  }));
};

const ProductListTastic = async ({
  data,
  searchParams,
  flatCategories = [],
  treeCategories = [],
}: TasticProps<DataSource<DataSourceProps> & Props>) => {
  if (!data.data?.dataSource) return <></>;

  const slug = data.data.dataSource?.category?.split('/')?.at(-1) ?? '';

  const category = flatCategories.find((c) => c.slug === slug);
  const treeCategory = treeCategories.find((c) => c.slug === slug);

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
    (treeCategory?.descendants?.length ?? 0) >= 3;

  return (
    <ProductListClientWrapper
      {...data.data.dataSource}
      items={filterMatchingVariants(data.data.dataSource.items)}
      categoryConfiguration={categoryConfiguration}
      categories={flatCategories}
      category={treeCategories.find((c) => c.slug === slug) ?? category}
      displayIntermediaryPage={isIntermediaryPage && !isSearchPage}
    />
  );
};

export default ProductListTastic;
