import { useCallback } from 'react';
import { sdk } from '@/sdk';

const useSessionStoreAndBusinessUnitKeys = () => {
  const setBusinessUnitAndStoreSessionKeys = useCallback(async (businessUnitKey: string, storeKey: string) => {
    await sdk.composableCommerce.businessUnit.setBusinessUnitAndStoreKeys(
      { businessUnitKey, storeKey },
      { skipQueue: true },
    );
  }, []);

  return { setBusinessUnitAndStoreSessionKeys };
};

export default useSessionStoreAndBusinessUnitKeys;
