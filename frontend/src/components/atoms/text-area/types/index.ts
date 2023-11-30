import { LabelProps } from '../../label/types';

export type TextAreaVariant = 'disabled' | 'readOnly' | 'valid' | 'error' | 'default';

export interface TextAreaProps
  extends React.ComponentProps<'textarea'>,
    Pick<LabelProps, 'requiredStyle' | 'showOptionalLabel'> {
  label?: string;
  valid?: boolean;
  error?: string;
  fitContent?: boolean;
}
