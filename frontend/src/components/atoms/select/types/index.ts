import { DropdownProps } from '../../dropdown/types';
import { LabelProps } from '../../label/types';

export interface Option {
  name: string;
  value: string;
}

export interface SelectProps extends DropdownProps, LabelProps {
  menuTop?: boolean;
  label?: React.ReactNode;
  placeholder?: string;
  options: Option[];
  enableSearch?: boolean;
  testId?: string;
  error?: string;
}
