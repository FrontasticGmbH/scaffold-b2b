'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { BusinessUnit, Store } from '@/types/entity/business-unit';
import useSessionStoreAndBusinessUnitKeys from '@/lib/hooks/useSessionStoreAndBusinessUnitKeys';
import { ContextShape } from './types';

const initialState = {} as ContextShape;
export const StoreAndBusinessUnitsContext = createContext(initialState);

const StoreAndBusinessUnitsProvider = ({ children }: React.PropsWithChildren) => {
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<BusinessUnit>();
  const [selectedStore, setSelectedStore] = useState<Store>();

  const { setBusinessUnitAndStoreSessionKeys } = useSessionStoreAndBusinessUnitKeys();

  useEffect(() => {
    if (selectedBusinessUnit?.key && selectedStore?.key)
      setBusinessUnitAndStoreSessionKeys(selectedBusinessUnit.key, selectedStore.key);
  }, [selectedBusinessUnit?.key, selectedStore?.key, setBusinessUnitAndStoreSessionKeys]);

  return (
    <StoreAndBusinessUnitsContext.Provider
      value={{
        selectedBusinessUnit,
        setSelectedBusinessUnit,
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
