import useCart from '@/lib/hooks/useCart';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import { mapProduct } from '@/utils/mappers/map-product';
import { DataSourceProps, Props } from '../../types';

const useMappedProducts = ({ items }: Partial<DataSourceProps & Props>) => {
  const { selectedBusinessUnit, selectedStore } = useStoreAndBusinessUnits();

  const { cart } = useCart(selectedBusinessUnit?.key, selectedStore?.key);

  const mappedProducts = (items ?? []).map((item) => mapProduct(item, { cart }));
  return mappedProducts;
};

export default useMappedProducts;
