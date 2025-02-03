import { classnames } from '@/utils/classnames/classnames';
import { cva } from '@/utils/classnames/cva';
import { UseClassNamesProps } from '../types';

const useClassNames = ({
  variant = 'primary',
  size = 's',
  className = '',
  includesIcon,
  isIconOnly,
  iconPosition,
  loading,
  asSkeleton = false,
}: UseClassNamesProps) => {
  const resolveButtonVariant = cva({
    intent: {
      primary: [
        'bg-primary text-white',
        'hover:bg-secondary hover:shadow-button hover:disabled:shadow-none',
        'active:bg-accent-blue',
        'focus:outline-[3px] focus:outline-blue-300',
        'disabled:border disabled:border-neutral-300 disabled:bg-neutral-200 disabled:text-gray-400',
      ],
      secondary: [
        'border border-gray-700 bg-white text-gray-700',
        'hover:bg-neutral-300 hover:shadow-button hover:disabled:shadow-none',
        'active:bg-neutral-400',
        'focus:outline-[3px] focus:outline-blue-300',
        'disabled:border disabled:border-gray-300 disabled:bg-white disabled:text-gray-400',
      ],
      warning: [
        'bg-red-500 text-white',
        'hover:bg-red-600 hover:shadow-button hover:disabled:shadow-none',
        'active:bg-red-300 active:text-gray-700',
        'focus:outline-[3px] focus:outline-gray-700',
        'disabled:border disabled:border-neutral-300 disabled:bg-neutral-200 disabled:text-gray-400',
      ],
      underlined: [
        'text-gray-700 underline underline-offset-2',
        'hover:text-gray-500',
        'active:text-primary',
        'focus:text-blue-700 focus:decoration-blue-300 focus:decoration-[3px] focus:outline-none',
        'disabled:text-gray-400',
      ],
      ghost: 'disabled:text-neutral-400',
    },
    size: {
      xs: 'px-3 py-2 text-12',
      s: 'px-6 py-2 text-14',
      m: 'px-9 py-3 text-14',
      l: 'px-12 py-3 text-16',
      fit: 'p-0',
      full: 'w-full py-3',
      icon: {
        xs: 'p-2',
        s: 'p-[10px]',
        m: 'p-3',
        l: 'p-[14px]',
      },
    },
  });

  const resolveIconVariant = cva({
    size: {
      xs: 'size-3',
      s: 'size-4',
      m: 'size-[18px]',
      l: 'size-5',
    },
  });

  const buttonClassName = classnames(
    (isIconOnly ? resolveButtonVariant(`size.icon.${size}`) : resolveButtonVariant(`size.${size}`)) as string,
    { 'flex items-center gap-1': includesIcon },
    { 'grid items-center justify-center': isIconOnly },
    { 'flex-row-reverse': includesIcon && iconPosition === 'left' },
    { 'cursor-not-allowed': loading },
    'relative overflow-hidden rounded-md font-medium leading-4 transition disabled:pointer-events-none',
    asSkeleton ? 'relative' : (resolveButtonVariant(`intent.${variant}`) as string),
    className,
  );

  const iconClassName = resolveIconVariant(`size.${size}`) as string;

  return { buttonClassName, iconClassName };
};

export default useClassNames;
