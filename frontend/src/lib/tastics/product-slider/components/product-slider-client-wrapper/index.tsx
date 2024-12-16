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
import useAccountRoles from '@/lib/hooks/useAccountRoles';
import { TasticProps } from '@/lib/tastics/types';
import toast from '@/components/atoms/toaster/helpers/toast';
import useTranslation from '@/providers/I18n/hooks/useTranslation';

const ProductSliderClientWrapper = ({
  data,
}: TasticProps<DataSource<{ items: Product[] }> & Pick<ProductSliderProps, 'headline'>>) => {
  const { translate } = useTranslation();

  const { selectedBusinessUnit, selectedStore } = useStoreAndBusinessUnits();

  const { isQuotationCart, addItem, cart } = useCart(selectedBusinessUnit?.key, selectedStore?.key);

  const { permissions } = useAccountRoles(selectedBusinessUnit?.key);

  const { path } = usePath();

  const items = data?.data?.dataSource?.items;

  if (!items) return <></>;

  if (path === '/cart/' && isQuotationCart) return <></>;

  return (
    <ProductSlider
      headline={data.headline}
      products={items
        .map((product) => mapProduct(product, { cart }))
        .filter((item) => item.inStock)
        .slice(0, 12)}
      addToCartDisabled={!permissions.UpdateMyCarts}
      onAddToCart={async (sku) => {
        const res = await addItem([{ sku, count: 1 }]);

        if (!res.success) toast.error(res.message || translate('common.something.went.wrong'));
      }}
    />
  );
};

export default ProductSliderClientWrapper;
