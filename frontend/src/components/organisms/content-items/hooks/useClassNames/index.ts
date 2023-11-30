import { Variant } from '@/components/molecules/content-item/types';
import { classnames } from '@/utils/classnames/classnames';
import { cva } from '@/utils/classnames/cva';

const useClassNames = (variant: Variant) => {
  const resolveVariant = cva({
    default: {
      container: 'bg-neutral-200',
      itemList: 'md:gap-5',
    },
    inline: {
      container: '',
      itemList: 'md:gap-4',
    },
  });

  const containerClassName = classnames(
    'px-4 pb-10 md:px-5 lg:px-12 lg:pb-12',
    resolveVariant(`${variant}.container`) as string,
  );

  const listClassName = classnames(
    'mx-auto grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4',
    resolveVariant(`${variant}.itemList`) as string,
  );

  return { containerClassName, listClassName };
};

export default useClassNames;
