import { Props } from './types';

const useStore = ({ activeBusinessUnit }: Props) => {
  const stores = activeBusinessUnit?.stores ?? [];

  const selectedStore = stores[0];

  return { stores, selectedStore };
};

export default useStore;
