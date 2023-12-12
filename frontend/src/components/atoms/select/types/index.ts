import { DropdownProps } from '../../dropdown/types';
import { LabelProps } from '../../label/types';

export interface Option {
  name: string;
  value: string;
}

export interface SelectProps extends DropdownProps, LabelProps {
  label?: React.ReactNode;
  placeholder?: string;
  options: Option[];
  enableSearch?: boolean;
}
