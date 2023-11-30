import { cva } from '@/utils/classnames/cva';
import { classnames } from '@/utils/classnames/classnames';
import { Variant } from '../../types';

const useClassNames = (variant: Variant) => {
  const resolveVariant = cva({
    default: {
      container: 'w-full flex-col items-center gap-2 py-5',
      image: 'h-[75px] w-[75px] md:h-[148px] md:w-[148px]',
      title: 'text-14 md:text-16',
    },
    inline: {
      container:
        'h-[52px] w-full flex-row items-center justify-center gap-3 border border-neutral-400 py-6 md:h-[60px] lg:h-[64px]',
      image: 'h-[20px] w-[20px] md:h-[24px] md:w-[24px]',
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
