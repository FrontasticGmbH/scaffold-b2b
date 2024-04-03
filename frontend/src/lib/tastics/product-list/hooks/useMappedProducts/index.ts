import { mapProduct } from '@/utils/mappers/map-product';
import { DataSourceProps, Props } from '../../types';

const useMappedProducts = ({ items }: Partial<DataSourceProps & Props>) => {
  const mappedProducts = (items ?? []).map((item) => mapProduct(item));
  return mappedProducts;
};

export default useMappedProducts;
