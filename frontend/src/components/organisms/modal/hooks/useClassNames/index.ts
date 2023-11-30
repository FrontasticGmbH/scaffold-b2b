import { classnames } from '@/utils/classnames/classnames';
import { cva } from '@/utils/classnames/cva';
import { Props } from '../../types';

const useClassNames = ({ className, size, centered, variant }: Partial<Props>) => {
  const resolveVariant = cva({
    intent: {
      default: classnames(
        'rounded-t-xl sm:rounded-lg',
        'left-1/2 top-1/2 -translate-x-1/2',
        centered ? '-translate-y-1/2' : '-translate-y-3/4',
      ),
      'sticky-bottom': 'inset-x-0 bottom-0 w-full rounded-t-[20px]',
    },
    size: {
      fit: 'h-fit w-fit',
      sm: 'sm:h-[260px] sm:w-[400px]',
      md: 'md:h-[400px] md:w-[600px]',
      lg: 'lg:h-[500px] lg:w-[800px]',
    },
  });

  const modalClassNames = classnames(
    className as string,
    'fixed h-[260px] w-full bg-white outline-none',
    resolveVariant(`intent.${variant}`) as string,
    resolveVariant(`size.${size}`) as string,
  );

  return { modalClassNames };
};

export default useClassNames;
