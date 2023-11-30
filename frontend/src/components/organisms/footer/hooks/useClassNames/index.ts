import { cva } from '@/utils/classnames/cva';
import { classnames } from '@/utils/classnames/classnames';
import { Variant } from '../../types';

const useClassNames = (variant: Variant) => {
  const resolveVariant = cva({
    default: 'pb-8 md:pb-14 md:pt-8',
    simple: 'py-8 lg:py-10',
  });

  const className = classnames('bg-gray-700', resolveVariant(variant) as string);

  return { className };
};

export default useClassNames;
