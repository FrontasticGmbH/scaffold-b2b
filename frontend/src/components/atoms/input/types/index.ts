import { LabelProps } from '../../label/types';

export type InputVariant = 'disabled' | 'readOnly' | 'valid' | 'error' | 'default';

export interface InputProps
  extends React.ComponentProps<'input'>,
    Pick<LabelProps, 'requiredStyle' | 'showOptionalLabel' | 'optionalLabel'> {
  label?: string;
  valid?: boolean;
  error?: string;
  clearButton?: boolean;
  onClear?: () => void;
  icon?: React.ReactNode;
  containerClassName?: string;
  unStyled?: boolean;
  focusOnMount?: boolean;
}
