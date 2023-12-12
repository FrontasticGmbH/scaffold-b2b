import { Product } from '@shared/types/product/Product';
import { TermFacet } from '@shared/types/query/TermFacet';
import { RangeFacet } from '@shared/types/query/RangeFacet';
import { Category } from '@shared/types/product/Category';

export interface DataSourceProps {
  category?: string;
  items: Array<Product>;
  facets: Array<
    Omit<RangeFacet | TermFacet | RangeFacet, 'terms'> & {
      label: string;
      selected?: boolean;
      terms?: Array<{
        identifier: string;
        label: string;
        count?: number;
        selected?: boolean;
      }>;
      min?: number;
      max?: number;
      minSelected?: number;
      maxSelected?: number;
      count?: number;
    }
  >;
  totalItems: number;
}

export interface Props {
  categories: Category[];
}
