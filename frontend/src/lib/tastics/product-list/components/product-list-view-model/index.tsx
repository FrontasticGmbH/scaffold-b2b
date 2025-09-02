'use client';

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ProductList from '@/components/organisms/product-list';
import { useTranslations } from 'use-intl';
import useCart from '@/lib/hooks/useCart';
import IntermediaryProductList from '@/components/organisms/product-list/components/intermediary-page';
import { resolveReference } from '@/utils/lib/resolve-reference';
import useCurrency from '@/hooks/useCurrency';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import useAccountRoles from '@/lib/hooks/useAccountRoles';
import toast from '@/components/atoms/toaster/helpers/toast';
import { mapCategory } from '@/utils/mappers/map-category';
import { DataSourceProps, ViewModelProps } from '../../types';
import useMappedProducts from '../../hooks/useMappedProducts';
import useMappedFacets from '../../hooks/useMappedFacets';
import useRefinement from '../../hooks/useRefinement';

const ProductListViewModel = ({
  items,
  category,
  facets,
  total,
  categories,
  categoryConfiguration,
  displayIntermediaryPage = false,
}: Omit<DataSourceProps, 'category'> & ViewModelProps) => {
  const translate = useTranslations();

  const { slug, locale } = useParams();

  const searchParams = useSearchParams();

  const searchQuery = searchParams.get('query');

  const isSearchPage = !!searchQuery;

  const currency = useCurrency();

  const mappedProducts = useMappedProducts({ items });

  const mappedFacets = useMappedFacets({ facets, categories });

  const rootCategory = category ? mapCategory(category, { locale }) : undefined;

  const { selectedBusinessUnit, selectedStore } = useStoreAndBusinessUnits();

  const { permissions } = useAccountRoles(selectedBusinessUnit?.key);

  const { addItem } = useCart(selectedBusinessUnit?.key, selectedStore?.key);

  const { onSortValueChange, currentSortValue, currentSortVector, limit, onLoadMore, onResetAll, onRefine } =
    useRefinement();

  const categoriesBreadcrumb = isSearchPage
    ? [
        { name: translate('common.home'), link: '/' },
        {
          name: translate('product.search-results'),
          link: '',
        },
      ]
    : [
        { name: translate('common.home'), link: '/' },
        ...(slug ?? []).map((chunk: string, index: number, arr: string[]) => ({
          name: chunk.replace(/[-_]/g, ' '),
          link: `/${arr.slice(0, index + 1).join('/')}`,
        })),
      ];

  if (displayIntermediaryPage) {
    const categoryConfig = categoryConfiguration[category?.slug ?? ''] ?? {};

    return (
      <IntermediaryProductList
        title={rootCategory?.name ?? ''}
        link={{ name: translate('common.shop-all'), href: `${category?._url}?view=1` }}
        breadcrumb={categoriesBreadcrumb}
        items={[
          ...(rootCategory?.descendants ?? []).map(({ name, path, categoryKey }) => {
            return {
              name: name ?? '',
              image: categoryConfiguration[categoryKey as keyof typeof categoryConfiguration]?.image,
              url: path,
            };
          }),
          {
            name: translate('common.view-all'),
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
      title={(isSearchPage ? `${translate('product.search-results-for')} "${searchQuery}"` : category?.name) ?? '#'}
      products={mappedProducts}
      breadcrumb={categoriesBreadcrumb}
      sortValues={[
        { name: `${translate('product.relevance')}`, value: '', vector: 'desc' },
        { name: `${translate('product.price')} (Asc)`, value: 'price', vector: 'asc' },
        { name: `${translate('product.price')} (Desc)`, value: 'price', vector: 'desc' },
      ]}
      addToCartDisabled={!permissions.UpdateMyCarts}
      currentSortValue={currentSortValue}
      currentSortVector={currentSortVector}
      facets={mappedFacets}
      limit={Math.min(limit, items.length)}
      total={total}
      onRefine={onRefine}
      onResetAll={onResetAll}
      onSortValueChange={onSortValueChange}
      onLoadMore={onLoadMore}
      onAddToCart={async (sku, qty) => {
        const res = await addItem([{ sku, count: qty }]);

        if (!res.success) toast.error(res.message || translate('common.something-went-wrong'));
      }}
    />
  );
};

export default ProductListViewModel;
