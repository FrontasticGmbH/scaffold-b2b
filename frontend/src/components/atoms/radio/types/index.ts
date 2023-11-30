import { ReactNode } from 'react';

export interface RadioProps extends Omit<React.ComponentProps<'input'>, 'size'> {
  size?: 'sm' | 'lg';
  label?: ReactNode;
  onSelected?: () => void;
}
