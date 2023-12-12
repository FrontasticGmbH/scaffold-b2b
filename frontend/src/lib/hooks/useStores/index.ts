import useBusinessUnits from '../useBusinessUnits';

const useStores = () => {
  const { defaultBusinessUnit } = useBusinessUnits();

  const stores = defaultBusinessUnit?.stores ?? [];

  const defaultStore = stores[0];

  return { stores, defaultStore };
};

export default useStores;
