import { useCallback, useState } from 'react';
import { sdk } from '@/sdk';

const useSessionStoreAndBusinessUnitKeys = () => {
  const [sessionIsUpdating, setSessionIsUpdating] = useState(false);

  const setBusinessUnitAndStoreSessionKeys = useCallback(async (businessUnitKey: string, storeKey: string) => {
    setSessionIsUpdating(true);
    await sdk.composableCommerce.businessUnit
      .setBusinessUnitAndStoreKeys({ businessUnitKey, storeKey })
      .catch(() => {});
    setSessionIsUpdating(false);
  }, []);

  return { setBusinessUnitAndStoreSessionKeys, sessionIsUpdating };
};

export default useSessionStoreAndBusinessUnitKeys;
