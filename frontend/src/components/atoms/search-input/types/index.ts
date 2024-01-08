export type SearchVariant = 'xs' | 'sm' | 'lg';

export interface SearchInputProps {
  variant: SearchVariant;
  disabled?: boolean;
  label?: string;
  searchValue?: string | readonly string[] | undefined;
  placeholder?: string;
  mobile?: boolean;
  focused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onBackClick?: () => void;
  handleOnChange?: (value: string) => void;
  handleSearchAction?: () => void;
  className?: string;
  containerClassName?: string;
}
