export interface Props {
  translations: {
    button?: string;
  };
  buttonLink: string;
  buttonDisabled?: boolean;
  onSearchChange?: (val: string) => void;
  isEmpty?: boolean;
  entity: string;
  isLoading?: boolean;
}
