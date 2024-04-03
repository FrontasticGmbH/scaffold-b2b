import React from 'react';
import dynamic from 'next/dynamic';
import { DataSourceProps, ViewModelProps } from '../../types';

const ProductListViewModel = dynamic(() => import('../product-list-view-model'));

const ProductListClientWrapper = (props: Omit<DataSourceProps, 'category'> & ViewModelProps) => {
  return <ProductListViewModel {...props} />;
};

export default ProductListClientWrapper;
