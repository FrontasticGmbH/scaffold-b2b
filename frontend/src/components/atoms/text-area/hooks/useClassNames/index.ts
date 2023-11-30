import { cva } from '@/utils/classnames/cva';
import { classnames } from '@/utils/classnames/classnames';
import { TextAreaProps, TextAreaVariant } from '../../types';

const useClassNames = (variant: TextAreaVariant, { fitContent }: Partial<TextAreaProps>) => {
  const resolveVariant = cva({
    default: 'border-gray-300 bg-white text-gray-600 focus:border-neutral-800 active:border-neutral-800',
    disabled: 'cursor-not-allowed border-neutral-200 bg-neutral-200 text-neutral-800 focus:border-neutral-200',
    readOnly:
      'cursor-default border-neutral-200 bg-neutral-200 text-gray-600 focus:border-neutral-200 active:border-neutral-800',
    error: 'border-red-500 bg-white text-gray-600 focus:border-red-500 active:border-red-500',
    valid: 'border-green-500 bg-white text-gray-600 focus:border-green-500 active:border-green-500',
  });

  const textAreaClassName = classnames(
    'flex w-full resize-none rounded-sm border px-3 py-[10px] text-14 focus:outline-none focus:ring-0',
    resolveVariant(variant) as string,
    {
      'overflow-hidden': fitContent,
    },
  );

  return { textAreaClassName };
};

export default useClassNames;
