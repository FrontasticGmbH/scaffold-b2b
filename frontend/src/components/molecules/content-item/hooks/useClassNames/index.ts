import { cva } from '@/utils/classnames/cva';
import { classnames } from '@/utils/classnames/classnames';
import { Variant } from '../../types';

const useClassNames = (variant: Variant) => {
  const resolveVariant = cva({
    default: {
      container: 'w-full flex-col items-center gap-2 py-5',
      image: 'size-[75px] md:size-[148px]',
      title: 'text-14 md:text-16',
    },
    inline: {
      container:
        'h-[52px] w-full flex-row items-center justify-center gap-3 border border-neutral-400 py-6 md:h-[60px] lg:h-[64px]',
      image: 'size-[20px] md:size-[24px]',
      title: 'text-14 leading-[16px] md:text-16 md:leading-[24px]',
    },
  });

  const containerClassName = classnames(
    'flex w-fit rounded-md bg-white',
    resolveVariant(`${variant}.container`) as string,
  );

  const imageClassName = classnames('relative', resolveVariant(`${variant}.image`) as string);

  const titleClassName = classnames('font-medium text-gray-700', resolveVariant(`${variant}.title`) as string);

  return { containerClassName, imageClassName, titleClassName };
};

export default useClassNames;
