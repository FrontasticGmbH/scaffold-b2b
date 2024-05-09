import { useCallback } from 'react';
import { useSWRConfig } from 'swr';

const useSwrClearCache = () => {
  const { mutate } = useSWRConfig();

  const clearCache = useCallback(() => {
    mutate(() => true, undefined, { revalidate: false });
  }, [mutate]);

  return clearCache;
};

export default useSwrClearCache;
