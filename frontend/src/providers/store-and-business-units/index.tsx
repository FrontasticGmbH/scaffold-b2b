import React, { createContext, useContext, useState } from 'react';
import { BusinessUnit, Store } from '@/types/entity/business-unit';
import { ContextShape } from './types';

const initialState = {} as ContextShape;
export const StoreAndBusinessUnitsContext = createContext(initialState);

const StoreAndBusinessUnitsProvider = ({ children }: React.PropsWithChildren) => {
  const [selectedBusinessUnits, setSelectedBusinessUnits] = useState<BusinessUnit>();
  const [selectedStore, setSelectedStore] = useState<Store>();

  return (
    <StoreAndBusinessUnitsContext.Provider
      value={{
        selectedBusinessUnit: selectedBusinessUnits,
        setSelectedBusinessUnit: setSelectedBusinessUnits,
        selectedStore,
        setSelectedStore,
      }}
    >
      {children}
    </StoreAndBusinessUnitsContext.Provider>
  );
};
export default StoreAndBusinessUnitsProvider;
export const useStoreAndBusinessUnits = () => useContext(StoreAndBusinessUnitsContext);
