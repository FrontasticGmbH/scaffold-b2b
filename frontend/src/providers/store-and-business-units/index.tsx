'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import useSessionStoreAndBusinessUnitKeys from '@/lib/hooks/useSessionStoreAndBusinessUnitKeys';
import useBusinessUnits from '@/lib/hooks/useBusinessUnits';
import { mapStore } from '@/utils/mappers/map-store';
import { mapBusinessUnit } from '@/utils/mappers/map-business-unit';
import { ContextShape } from './types';

const initialState = {} as ContextShape;
export const StoreAndBusinessUnitsContext = createContext(initialState);

const StoreAndBusinessUnitsProvider = ({ children }: React.PropsWithChildren) => {
  const [selectedBusinessUnitKey, setSelectedBusinessUnitKey] = useState('');
  const [selectedStoreKey, setSelectedStoreKey] = useState('');

  const { setBusinessUnitAndStoreSessionKeys, sessionIsUpdating } = useSessionStoreAndBusinessUnitKeys();

  const { businessUnits, defaultBusinessUnit } = useBusinessUnits();

  const selectedBusinessUnit = businessUnits.find((bu) => bu.key === selectedBusinessUnitKey) ?? defaultBusinessUnit;
  const selectedStore =
    selectedBusinessUnit?.stores?.find((st) => st.key === selectedStoreKey) ?? selectedBusinessUnit?.stores?.[0];

  const handleBusinessUnitSelection = useCallback(
    async (key: string) => {
      const businessUnit = businessUnits.find((bu) => bu.key === key);

      if (businessUnit && businessUnit.stores?.[0]?.key) {
        await setBusinessUnitAndStoreSessionKeys(key, businessUnit.stores[0].key);

        localStorage.setItem('bu-key', key);
        localStorage.setItem('st-key', businessUnit.stores[0].key);

        setSelectedBusinessUnitKey(key);
        setSelectedStoreKey(businessUnit.stores[0].key);
      }
    },
    [businessUnits, setBusinessUnitAndStoreSessionKeys],
  );

  const handleStoreSelection = useCallback(
    (key: string) => {
      if (selectedBusinessUnit) {
        const store = selectedBusinessUnit.stores?.find((st) => st.key === key);

        if (!store) return;

        setBusinessUnitAndStoreSessionKeys(selectedBusinessUnit.key as string, key);

        localStorage.setItem('st-key', key);

        setSelectedStoreKey(key);
      }
    },
    [setBusinessUnitAndStoreSessionKeys, selectedBusinessUnit],
  );

  useEffect(() => {
    const buInStorage = businessUnits.find((bu) => bu.key === localStorage.getItem('bu-key'));
    const stInStorage = buInStorage?.stores?.find((bu) => bu.key === localStorage.getItem('st-key'));

    if (buInStorage?.key && stInStorage?.key) {
      setSelectedBusinessUnitKey(buInStorage.key);
      setSelectedStoreKey(stInStorage.key);
    }
  }, [businessUnits]);

  const clearBusinessUnitAndStoreFromStorage = useCallback(() => {
    localStorage.removeItem('bu-key');
    localStorage.removeItem('st-key');
  }, []);

  return (
    <StoreAndBusinessUnitsContext.Provider
      value={{
        selectedBusinessUnit: selectedBusinessUnit ? mapBusinessUnit(selectedBusinessUnit) : undefined,
        selectedStore: selectedStore ? mapStore(selectedStore) : selectedStore,
        setSelectedBusinessUnitKey: handleBusinessUnitSelection,
        setSelectedStoreKey: handleStoreSelection,
        clearBusinessUnitAndStoreFromStorage,
        sessionIsUpdating,
      }}
    >
      {children}
    </StoreAndBusinessUnitsContext.Provider>
  );
};
export default StoreAndBusinessUnitsProvider;
export const useStoreAndBusinessUnits = () => useContext(StoreAndBusinessUnitsContext);
