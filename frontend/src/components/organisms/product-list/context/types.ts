import { Facet } from '@/types/entity/facet';
import { ProductListProps } from '../types';

export type ProductListView = 'grid' | 'list';

export type ProductListContextProps = ProductListProps;

export interface ProductListContextShape extends Omit<ProductListContextProps, 'onRefine'> {
  onRefine: (facet: Facet) => void;
  view: ProductListView;
  onChangeView: (view: ProductListView) => void;
}
