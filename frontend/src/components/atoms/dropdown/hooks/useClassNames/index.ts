import { cva } from '@/utils/classnames/cva';
import { classnames } from '@/utils/classnames/classnames';
import { DropdownProps } from '../../types';

const useClassNames = ({ disabled, size }: Partial<DropdownProps>) => {
  const intent = disabled ? 'disabled' : 'active';

  const resolveButtonVariant = cva({
    intent: {
      active: 'cursor-default border-gray-300 bg-white text-gray-700 focus:shadow-200 active:border-neutral-800',
      disabled: 'cursor-not-allowed border-neutral-200 bg-neutral-200 text-neutral-800',
    },
    size: {
      sm: 'py-2',
      lg: 'py-3',
    },
  });

  const buttonClassName = classnames(
    'relative w-full rounded-md border pl-3 pr-10 text-left text-14 focus:outline-none',
    resolveButtonVariant(`intent.${intent}`) as string,
    resolveButtonVariant(`size.${size}`) as string,
  );

  return { buttonClassName };
};

export default useClassNames;
