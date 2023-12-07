import { Store } from '@shared/types/store/Store';
import useBusinessUnits from '../useBusinessUnits';

const useStores = () => {
  const { defaultBusinessUnit } = useBusinessUnits();

  const stores = defaultBusinessUnit?.stores ?? [];

  const defaultStore = stores[0] as Store | undefined;

  return { stores, defaultStore };
};

export default useStores;
