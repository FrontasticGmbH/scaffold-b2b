'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ProductSliderProps } from '@/components/organisms/product-slider/types';
import { DataSource } from '@/types/lib/datasources';
import { Product } from '@shared/types/product';
import { TasticProps } from '../types';

const ProductSliderClientWrapper = dynamic(() => import('./components/product-slider-client-wrapper'));

const ProductSliderTastic = (
  props: TasticProps<DataSource<{ items: Product[] }> & Pick<ProductSliderProps, 'headline'>>,
) => {
  return <ProductSliderClientWrapper {...props} />;
};

export default ProductSliderTastic;
