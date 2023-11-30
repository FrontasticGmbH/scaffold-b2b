import { InputProps, InputVariant } from '../../types';

const useVariant = ({ disabled, readOnly, valid, error }: InputProps): InputVariant => {
  const variant = (() => {
    if (disabled) return 'disabled';
    if (readOnly) return 'readOnly';
    if (valid) return 'valid';
    if (error) return 'error';
    return 'default';
  })();

  return variant;
};

export default useVariant;
