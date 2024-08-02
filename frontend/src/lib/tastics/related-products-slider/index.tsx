'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { DataSource } from '@/types/lib/datasources';
import { Product } from '@shared/types/product';
import { TasticProps } from '../types';

const ProductSliderClientWrapper = dynamic(() => import('../product-slider/components/product-slider-client-wrapper'));

const RelatedProductSliderTastic = (props: TasticProps<DataSource<{ items: Product[] }>>) => {
  return <ProductSliderClientWrapper {...props} />;
};

export default RelatedProductSliderTastic;
