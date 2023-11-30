import { classnames } from '@/utils/classnames/classnames';
import { cva } from '@/utils/classnames/cva';
import { UseClassNames } from '../types';

const useClassNames: UseClassNames = ({
  variant = 'primary',
  size = 's',
  className = '',
  includesIcon,
  iconPosition,
  loading,
  asSkeleton = false,
}) => {
  const resolveVariant = cva({
    intent: {
      primary: [
        'bg-primary text-neutral-100 outline-offset-0',
        'hover:bg-secondary',
        'active:bg-primary active:shadow-button active:disabled:shadow-none',
        'border-primary focus-visible:border focus-visible:outline focus-visible:outline-offset-[3px] focus-visible:outline-primary',
        'disabled:bg-neutral-400 disabled:text-neutral-100',
      ],
      secondary: [
        'rounded-md border border-gray-700 bg-white text-gray-700',
        'hover:shadow-[0px_0px_3px_rgba(71,71,1)]',
        'active:shadow-button active:outline-2 active:outline-offset-0 active:outline-gray-300 active:disabled:shadow-none',
        'focus-visible:border focus-visible:outline focus-visible:outline-offset-[3px]',
        'disabled:border-neutral-400 disabled:bg-transparent disabled:text-neutral-400',
      ],
      warning: [
        'bg-red-500 text-neutral-100 outline-offset-0',
        'hover:bg-red-600',
        'active:bg-red-500 active:shadow-button active:disabled:shadow-none',
        'focus-visible:border focus-visible:border-red-700 focus-visible:bg-red-700 focus-visible:outline focus-visible:outline-offset-[3px] focus-visible:outline-primary',
        'disabled:bg-neutral-400 disabled:text-neutral-100',
      ],
      underlined: 'pb-2 text-gray-700 underline hover:text-gray-500 disabled:text-neutral-400',
      ghost: 'disabled:text-neutral-400',
    },
    size: {
      xs: 'p-2 text-12',
      s: 'px-6 py-2 text-14',
      m: 'px-9 py-3 text-14',
      l: 'px-12 py-3 text-16',
      fit: 'p-0',
      full: 'w-full py-3',
      icon: 'grid h-10 w-10 items-center justify-center',
    },
  });

  const buttonClassName = classnames(
    resolveVariant(`size.${size}`) as string,
    { 'rounded-md': variant !== 'ghost' },
    { 'flex items-center gap-1': includesIcon },
    { 'flex-row-reverse': includesIcon && iconPosition === 'left' },
    { 'cursor-not-allowed': !!loading },
    'relative overflow-hidden font-medium leading-4 transition disabled:pointer-events-none',
    asSkeleton ? 'relative' : (resolveVariant(`intent.${variant}`) as string),
    className,
  );

  return buttonClassName;
};

export default useClassNames;
