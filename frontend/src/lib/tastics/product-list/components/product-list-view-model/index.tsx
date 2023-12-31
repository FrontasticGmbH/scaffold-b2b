'use client';

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ProductList from '@/components/organisms/product-list';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import useCart from '@/lib/hooks/useCart';
import IntermediaryProductList from '@/components/organisms/product-list/components/intermediary-page';
import { resolveReference } from '@/utils/lib/resolve-reference';
import useCurrency from '@/hooks/useCurrency';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import { DataSourceProps, ViewModelProps } from '../../types';
import useMappedProducts from '../../hooks/useMappedProducts';
import useMappedFacets from '../../hooks/useMappedFacets';
import useRefinement from '../../hooks/useRefinement';

const ProductListViewModel = ({
  items,
  category,
  facets,
  totalItems,
  categories,
  categoryConfiguration,
  displayIntermediaryPage = false,
}: Omit<DataSourceProps, 'category'> & ViewModelProps) => {
  const { translate } = useTranslation();

  const { slug } = useParams();

  const searchParams = useSearchParams();

  const searchQuery = searchParams.get('query');

  const isSearchPage = !!searchQuery;

  const currency = useCurrency();

  const mappedProducts = useMappedProducts({ items });

  const mappedFacets = useMappedFacets({ facets, categories });

  const { selectedBusinessUnit, selectedStore } = useStoreAndBusinessUnits();

  const { addItem } = useCart(selectedBusinessUnit?.key, selectedStore?.key);

  const { onSortValueChange, currentSortValue, limit, onLoadMore, onResetAll, onRefine } = useRefinement();

  const categoriesBreadcrumb = isSearchPage
    ? [
        { name: translate('common.home'), link: '/' },
        {
          name: translate('product.search.results'),
          link: '',
        },
      ]
    : [
        { name: translate('common.home'), link: '/' },
        ...slug.split('/').map((chunk, index, arr) => ({
          name: chunk.replace(/-/g, ' '),
          link: `/${arr.slice(0, index + 1).join('/')}`,
        })),
      ];

  if (displayIntermediaryPage) {
    const categoryConfig = categoryConfiguration[category?.slug ?? ''] ?? {};

    return (
      <IntermediaryProductList
        title={category?.name ?? ''}
        link={{ name: translate('common.shop.all'), href: `${category?._url}?view=1` }}
        breadcrumb={categoriesBreadcrumb}
        items={[
          ...(category?.subCategories ?? []).map(({ name, slug, _url }) => ({
            name: name ?? '',
            image: categoryConfiguration[slug ?? '']?.image,
            url: _url,
          })),
          {
            name: translate('common.view.all'),
            image: categoryConfig?.image,
            url: `${category?._url}?view=1`,
          },
        ]}
        highlight={{
          headline: categoryConfig.highlightHeadline,
          subline: categoryConfig.highlightSubline,
          cta: resolveReference(categoryConfig.highlightCtaReference, categoryConfig.highlightCta),
          items: (categoryConfig.highlightItems ?? []).map(
            ({ name, image, price, reference, pressTargetPosition }) => ({
              name,
              image,
              price,
              currency,
              url: resolveReference(reference).href ?? '#',
              pressTargetPosition: pressTargetPosition ?? 'bottom',
            }),
          ),
        }}
      />
    );
  }

  return (
    <ProductList
      title={(isSearchPage ? `${translate('product.search.results.for')} "${searchQuery}"` : category?.name) ?? '#'}
      products={mappedProducts}
      breadcrumb={categoriesBreadcrumb}
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
