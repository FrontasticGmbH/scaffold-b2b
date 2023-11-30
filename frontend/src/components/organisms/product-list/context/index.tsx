import React, { useCallback, useContext, useState } from 'react';
import { Facet } from '@/types/entity/facet';
import { ProductListContextProps, ProductListContextShape, ProductListView } from './types';

const ProductListContext = React.createContext({} as ProductListContextShape);

const ProductListProvider = ({
  children,
  facets,
  onRefine,
  ...props
}: React.PropsWithChildren<ProductListContextProps>) => {
  const [view, setView] = useState<ProductListView>('list');

  const handleRefine = useCallback(
    (facet: Facet) => {
      const newFacets = [...facets.filter((f) => f.id !== facet.id), facet];

      onRefine(newFacets);
    },
    [facets, onRefine],
  );

  return (
    <ProductListContext.Provider
      value={{
        facets,
        onRefine: handleRefine,
        view,
        onChangeView: setView,
        ...props,
      }}
    >
      {children}
    </ProductListContext.Provider>
  );
};

export default ProductListProvider;

export const useProductList = () => useContext(ProductListContext);
