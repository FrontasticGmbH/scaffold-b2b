import { ReactNode } from 'react';

export interface CheckboxProps extends Omit<React.ComponentProps<'input'>, 'size'> {
  containerClassName?: string;
  size?: 'sm' | 'lg';
  label?: ReactNode;
  onChecked?: (val: boolean) => void;
}
