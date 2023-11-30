import { useCallback, useMemo, useState } from 'react';
import { Props } from './types';

const useStore = ({ activeBusinessUnit }: Props) => {
  const [selectedStoreKey, setSelectedStoreKey] = useState<string>();

  const stores = useMemo(() => activeBusinessUnit?.stores ?? [], [activeBusinessUnit?.stores]);

  const storeOptions = stores.map(({ name, key }) => ({
    name: name ?? key ?? '',
    value: key,
  }));

  const onStoreSelected = useCallback((key: string) => {
    setSelectedStoreKey(key);
  }, []);

  const selectedStore = stores.find((store) => store.key === selectedStoreKey);

  return { stores, storeOptions, selectedStore, onStoreSelected };
};

export default useStore;
