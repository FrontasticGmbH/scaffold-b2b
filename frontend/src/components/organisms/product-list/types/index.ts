import { Option } from '@/components/atoms/select/types';
import { Facet } from '@/types/entity/facet';
import { Product } from '@/types/entity/product';

export interface CategoryBreadcrumb {
  name: string;
  link: string;
}

export interface ProductListProps {
  products: Product[];
  facets: Facet[];
  searchQuery?: string;
  breadcrumb: Array<CategoryBreadcrumb>;
  onRefine: (facet: Facet[]) => void;
  onResetAll: () => void;
  currentSortValue: string;
  sortValues: Option[];
  onSortValueChange: (sortValue: string) => void;
  title: string;
  limit: number;
  total: number;
  onLoadMore: () => void;
  onAddToCart: (sku: string, qty: number) => Promise<void>;
}
