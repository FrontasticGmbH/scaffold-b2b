import { useCallback, useMemo, useState } from 'react';
import { BusinessUnit } from '@shared/types/business-unit';

const useStore = ({ activeBusinessUnit }: { activeBusinessUnit?: BusinessUnit }) => {
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
