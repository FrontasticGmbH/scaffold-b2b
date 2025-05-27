import { useCallback, useState } from 'react';
import { sdk } from '@/sdk';
import { useSWRConfig } from 'swr';

const useSessionStoreAndBusinessUnitKeys = () => {
  const [sessionIsUpdating, setSessionIsUpdating] = useState(false);
  const { mutate: globalMutate } = useSWRConfig();

  const setBusinessUnitAndStoreSessionKeys = useCallback(
    async (businessUnitKey: string, storeKey: string) => {
      setSessionIsUpdating(true);
      await sdk.composableCommerce.businessUnit
        .setBusinessUnitAndStoreKeys({ businessUnitKey, storeKey })
        .catch(() => {});
      setSessionIsUpdating(false);
      globalMutate((key) => typeof key === 'object' && key?.[0] === '/action/wishlist/');
    },
    [globalMutate],
  );

  return { setBusinessUnitAndStoreSessionKeys, sessionIsUpdating };
};

export default useSessionStoreAndBusinessUnitKeys;
