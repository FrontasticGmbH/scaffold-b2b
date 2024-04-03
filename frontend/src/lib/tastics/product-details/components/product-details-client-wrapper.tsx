'use client';

import dynamic from 'next/dynamic';
import { ProductDetailsTasticProps } from '../types';

const ProductDetailsMapper = dynamic(() => import('./product-details-mapper'));

const ProductDetailsClientWrapper = ({ data }: ProductDetailsTasticProps) => {
  if (!data.data?.dataSource?.product) return <></>;

  return <ProductDetailsMapper product={data.data.dataSource.product} />;
};

export default ProductDetailsClientWrapper;
