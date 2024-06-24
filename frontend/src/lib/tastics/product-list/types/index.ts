import { Product } from '@shared/types/product/Product';
import { TermFacet } from '@shared/types/query/TermFacet';
import { RangeFacet } from '@shared/types/query/RangeFacet';
import { Category } from '@shared/types/product/Category';
import { Image } from '@/types/image';
import { Reference } from '@/types/lib/reference';
import { FrontasticImage } from '@/types/lib/image';

export interface DataSourceProps {
  category?: string;
  items: Array<Product>;
  facets: Array<
    Omit<RangeFacet | TermFacet, 'terms'> & {
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

export interface CategoryConfiguration {
  key: string;
  image?: FrontasticImage;
  highlightHeadline?: string;
  highlightSubline?: string;
  highlightCta?: string;
  highlightCtaReference?: Reference;
  highlightItems: Array<CategoryHighlightItem>;
}

export interface CategoryHighlightItem {
  image: Image;
  name: string;
  price: number;
  reference: Reference;
  pressTargetPosition: 'top' | 'bottom';
}

export interface Props {
  categories: Array<Category>;
  useIntermediaryCategoryPage?: boolean;
  categoryConfiguration: CategoryConfiguration[];
}

export interface ViewModelProps {
  categories: Array<Category>;
  category?: Category;
  categoryConfiguration: Record<string, CategoryConfiguration>;
  displayIntermediaryPage?: boolean;
}
