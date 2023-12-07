import { mapProduct } from '@/utils/mappers/map-product';
import { DataSourceProps, Props } from '../../types';

const useMappedProducts = ({ items }: Partial<DataSourceProps & Props>) => {
  const mappedProducts = (items ?? []).map(mapProduct);
  return mappedProducts;
};

export default useMappedProducts;
