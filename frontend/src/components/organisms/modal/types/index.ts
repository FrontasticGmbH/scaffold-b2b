import { Props as ReactModalProps } from 'react-modal';

export type Size = 'fit' | 'sm' | 'md' | 'lg';

export type Variant = 'default' | 'sticky-bottom';

export interface Props extends ReactModalProps {
  closeButton?: boolean;
  size?: Size;
  centered?: boolean;
  variant?: Variant;
}
