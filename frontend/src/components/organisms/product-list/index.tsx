'use client';

import React from 'react';
import { ProductListProps } from './types';
import ProductListProvider from './context';
import Header from './components/header';
import FacetsDrawer from './components/facets-drawer';
import List from './components/list';
import InfiniteLoad from './components/infinite-load';
import Facets from './components/facets';
import ViewToggle from './components/view-toggle';
import SortDropdown from './components/sort-dropdown';
import CurrentRefinements from './components/current-refinements';
import CategoriesBreadcrumb from './components/breadcrumb';

const ProductList = (props: ProductListProps) => {
  return (
    <ProductListProvider {...props}>
      <div className="mt-5 hidden px-4 md:px-6 lg:block lg:px-12">
        <CategoriesBreadcrumb {...props} />
      </div>
      <div className="px-4 pb-12 md:px-6 lg:px-12 xl:flex xl:gap-6 xl:pb-[72px]">
        <div className="xl:max-w-[340px]">
          <Header />
          <div className="mt-4 xl:hidden">
            <FacetsDrawer />
          </div>
          <div className="mt-2 hidden border-t border-neutral-400 xl:block">
            <Facets />
          </div>
        </div>

        <div className="pt-4 xl:grow xl:pt-[62px]">
          <div className="hidden items-center justify-between xl:flex">
            <CurrentRefinements />
            <div className="flex items-center gap-3">
              <SortDropdown />
              <ViewToggle />
            </div>
          </div>

          <div className="xl:mt-3">
            <List {...props} />
          </div>

          <div className="mt-11">
            <InfiniteLoad />
          </div>
        </div>
      </div>
    </ProductListProvider>
  );
};

export default ProductList;
