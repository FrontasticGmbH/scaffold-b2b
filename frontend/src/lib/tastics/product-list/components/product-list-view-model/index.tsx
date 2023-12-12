'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ProductList from '@/components/organisms/product-list';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import useBusinessUnits from '@/lib/hooks/useBusinessUnits';
import useCart from '@/lib/hooks/useCart';
import useStores from '@/lib/hooks/useStores';
import { DataSourceProps, Props } from '../../types';
import useMappedProducts from '../../hooks/useMappedProducts';
import useMappedFacets from '../../hooks/useMappedFacets';
import useRefinement from '../../hooks/useRefinement';

const ProductListViewModel = ({ items, facets, category, totalItems, categories }: DataSourceProps & Props) => {
  const { translate } = useTranslation();

  const { slug } = useParams();

  const mappedProducts = useMappedProducts({ items });

  const mappedFacets = useMappedFacets({ facets, categories });

  const { defaultBusinessUnit } = useBusinessUnits();

  const { defaultStore } = useStores();

  const { addItem } = useCart(defaultBusinessUnit?.key, defaultStore?.key);

  const { onSortValueChange, currentSortValue, limit, onLoadMore, onResetAll, onRefine } = useRefinement();

  return (
    <ProductList
      title={category?.split('/')?.at(-1) ?? ''}
      products={mappedProducts}
      breadcrumb={slug
        .split('/')
        .map((chunk, index, arr) => ({ name: chunk, link: `/${arr.slice(0, index + 1).join('/')}` }))}
      sortValues={[
        // { name: translate('product.featured'), value: 'featured' },
        { name: translate('product.price'), value: 'price' },
        // { name: translate('product.best-selling'), value: 'best-selling' },
        // { name: translate('product.newest'), value: 'newest' },
      ]}
      currentSortValue={currentSortValue}
      facets={mappedFacets}
      limit={Math.min(limit, items.length)}
      total={totalItems}
      onRefine={onRefine}
      onResetAll={onResetAll}
      onSortValueChange={onSortValueChange}
      onLoadMore={onLoadMore}
      onAddToCart={async (sku, qty) => {
        await addItem([{ sku, count: qty }]);
      }}
    />
  );
};

export default ProductListViewModel;
