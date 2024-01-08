import { DropdownProps } from '../../dropdown/types';

export interface Option {
  name: string;
  value: string;
  count?: number;
  selected?: boolean;
  onSelected?: (checked: boolean) => void;
}

export interface RefinementDropdownProps extends DropdownProps {
  options: Option[];
}
