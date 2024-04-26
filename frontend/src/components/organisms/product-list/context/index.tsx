import React, { useCallback, useContext, useState } from 'react';
import { Facet } from '@/types/entity/facet';
import { ProductListContextProps, ProductListContextShape, ProductListEvents, ProductListView } from './types';

const ProductListContext = React.createContext({} as ProductListContextShape);

const ProductListProvider = ({
  children,
  facets,
  onRefine,
  onResetAll,
  ...props
}: React.PropsWithChildren<ProductListContextProps>) => {
  const [events, setEvents] = useState<ProductListEvents>({ clearAll: [] });

  const fireEvent = useCallback(
    (event: keyof ProductListEvents) => {
      for (const cb of events[event]) cb();
    },
    [events],
  );

  const subscribe = useCallback((event: keyof ProductListEvents, cb: () => void) => {
    setEvents((events) => ({ ...events, [event]: [...events[event], cb] }));

    return () =>
      setEvents((events) => ({ ...events, [event]: events[event].filter((c) => c.toString() != cb.toString()) }));
  }, []);

  const [view, setView] = useState<ProductListView>('list');

  const handleRefine = useCallback(
    (facet: Facet) => {
      const newFacets = [...facets.filter((f) => f.id !== facet.id), facet];

      onRefine(newFacets);
    },
    [facets, onRefine],
  );

  const handleResetAll = useCallback(() => {
    onResetAll();
    fireEvent('clearAll');
  }, [onResetAll, fireEvent]);

  return (
    <ProductListContext.Provider
      value={{
        facets,
        onRefine: handleRefine,
        view,
        onChangeView: setView,
        onResetAll: handleResetAll,
        fireEvent,
        subscribe,
        ...props,
      }}
    >
      {children}
    </ProductListContext.Provider>
  );
};

export default ProductListProvider;

export const useProductList = () => useContext(ProductListContext);
