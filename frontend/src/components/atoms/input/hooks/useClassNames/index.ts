import { cva } from '@/utils/classnames/cva';
import { classnames } from '@/utils/classnames/classnames';
import { InputVariant } from '../../types';

const useClassNames = (variant: InputVariant, isFocused: boolean, unStyled: boolean) => {
  const resolveVariant = cva({
    default: classnames('border-gray-300 bg-white text-gray-600 focus:border-neutral-800 active:border-neutral-800', {
      'border-neutral-800': isFocused,
    }),
    disabled: 'cursor-not-allowed border-neutral-200 bg-neutral-200 text-neutral-800 focus:border-neutral-200',
    readOnly:
      'cursor-default border-neutral-200 bg-neutral-200 text-gray-600 focus:border-neutral-200 active:border-neutral-800',
    error: 'border-red-500 bg-white text-gray-600 focus:border-red-500 active:border-red-500',
    valid: 'border-green-500 bg-white text-gray-600 focus:border-green-500 active:border-green-500',
  });

  const inputClassName = classnames('w-full border-none bg-transparent pr-0 text-14 focus:outline-none focus:ring-0', {
    'py-[10px] pl-3': !unStyled,
  });

  const containerClassName = classnames({
    'flex rounded-sm border focus:outline-none focus:ring-0': !unStyled,
    [resolveVariant(variant) as string]: !unStyled,
  });

  return { inputClassName, containerClassName };
};

export default useClassNames;
