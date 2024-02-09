'use client';

import React from 'react';
import ProductSlider from '@/components/organisms/product-slider';
import { ProductSliderProps } from '@/components/organisms/product-slider/types';
import { DataSource } from '@/types/lib/datasources';
import { Product } from '@shared/types/product';
import { mapProduct } from '@/utils/mappers/map-product';
import useCart from '@/lib/hooks/useCart';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import usePath from '@/hooks/usePath';
import { TasticProps } from '../types';

const ProductSliderTastic = ({
  data,
}: TasticProps<DataSource<{ items: Product[] }> & Pick<ProductSliderProps, 'headline'>>) => {
  const { selectedBusinessUnit, selectedStore } = useStoreAndBusinessUnits();

  const { isQuotationCart, addItem } = useCart(selectedBusinessUnit?.key, selectedStore?.key);

  const { path } = usePath();

  const items = data?.data?.dataSource?.items;

  if (!items) return <></>;

  if (path === '/cart/' && isQuotationCart) return <></>;

  return (
    <ProductSlider
      headline={data.headline}
      products={items
        .map(mapProduct)
        .filter((item) => item.inStock)
        .slice(0, 12)}
      onAddToCart={async (sku) => {
        await addItem([{ sku, count: 1 }]);
      }}
    />
  );
};

export default ProductSliderTastic;
