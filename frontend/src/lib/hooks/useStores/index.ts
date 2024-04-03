import { Store } from '@shared/types/store/Store';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';

const useStores = () => {
  const { selectedBusinessUnit } = useStoreAndBusinessUnits();

  const stores = selectedBusinessUnit?.stores ?? [];

  const defaultStore = stores[0] as Store | undefined;

  return { stores, defaultStore };
};

export default useStores;
