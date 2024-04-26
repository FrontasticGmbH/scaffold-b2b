import { Facet } from '@/types/entity/facet';
import { ProductListProps } from '../types';

export type ProductListView = 'grid' | 'list';

export interface ProductListEvents {
  clearAll: (() => void)[];
}

export type ProductListContextProps = ProductListProps;

export interface ProductListContextShape extends Omit<ProductListContextProps, 'onRefine'> {
  onRefine: (facet: Facet) => void;
  view: ProductListView;
  onChangeView: (view: ProductListView) => void;
  fireEvent: (event: keyof ProductListEvents) => void;
  subscribe: (event: keyof ProductListEvents, cb: () => void) => () => void;
}
