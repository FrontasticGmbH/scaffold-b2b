import { classnames } from '@/utils/classnames/classnames';
import { cva } from '@/utils/classnames/cva';
import { Variant } from '../../types';

const useClassNames = (variant: Variant) => {
  const resolveVariant = cva({
    intent: {
      primary: 'bg-blue-100 text-blue-600',
      light: 'bg-neutral-200 text-blue-500',
      secondary: 'bg-neutral-200 text-gray-700',
      warning: 'bg-yellow-100 text-yellow-700',
      success: 'bg-green-100 text-green-700',
      danger: 'bg-red-100 text-red-600',
    },
  });

  const className = classnames(
    'w-fit rounded-md px-2 py-1 text-12 font-medium',
    resolveVariant(`intent.${variant}`) as string,
  );

  return { className };
};

export default useClassNames;
