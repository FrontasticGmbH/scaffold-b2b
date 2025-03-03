import { SearchVariant } from '@/components/atoms/search-input/types';

export interface ProductSuggestion {
  id: string;
  key?: string;
  ref?: string;
  sku: string;
  name: string;
  url: string;
  image: string;
  maxQuantity?: number;
}
export interface SearchProps {
  ref?: React.ForwardedRef<HTMLInputElement | null>;
  scrollControl: boolean;
  variant: SearchVariant;
  disabled?: boolean;
  searchValue?: string;
  handleOnChange?: (value: string) => void;
  searchResult?: ProductSuggestion[];
  filterSearch: boolean;
  placeholder: string;
  suggestions?: ProductSuggestion[];
  onProductClick?: (product: ProductSuggestion) => void;
  handleSearchAction?: () => void;
}
export interface SearchPanelProps {
  variant: SearchVariant;
  panelItems: ProductSuggestion[];
  className?: string;
  onClick?: (product: ProductSuggestion) => void;
}
