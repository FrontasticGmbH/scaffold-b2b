import { DataSource } from '@/types/lib/datasources';
import { Product } from '@shared/types/product';
import { TasticProps } from '../../types';

export type ProductDetailsMapperProps = { product: Product };
export type ProductDetailsTasticProps = TasticProps<DataSource<ProductDetailsMapperProps>>;
