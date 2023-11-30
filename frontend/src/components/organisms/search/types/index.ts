import { SearchVariant } from '@/components/atoms/search-input/types';
import { Image } from '@/types/image';

export interface Suggestion {
  id: string;
  sku: string;
  name: string;
  maxQuantity?: number;
  url?: string;
  image?: Image;
}
export interface SearchProps {
  scrollControl: boolean;
  variant: SearchVariant;
  disabled?: boolean;
  searchValue?: string;
  handleOnChange?: (value: string) => void;
  searchResult?: Suggestion[];
  filterSearch: boolean;
  placeholder: string;
  suggestions?: Suggestion[];
  onClick?: (product: Suggestion) => void;
}
export interface SearchPanelProps {
  className?: string;
  panelItems: Suggestion[];
  onClick?: (product: Suggestion) => void;
}
