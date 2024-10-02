import { classnames } from '@/utils/classnames/classnames';
import { cva } from '@/utils/classnames/cva';
import { RadioProps } from '../../types';

const useClassNames = ({ checked, size, disabled }: RadioProps) => {
  const checkedVariant = checked ? 'checked' : 'unChecked';
  const disabledVariant = disabled ? 'disabled' : 'active';

  const resolveRadioVariant = cva({
    intent: {
      active: {
        checked:
          'cursor-pointer border-gray-300 checked:border-gray-300 checked:bg-white checked:hover:border-gray-300 checked:hover:bg-white checked:focus:border-gray-300 checked:focus:bg-white',
        unChecked: 'cursor-pointer border-gray-300 bg-white hover:border-gray-600',
      },
      disabled: {
        checked:
          'cursor-not-allowed border-gray-300 bg-gray-300 bg-none checked:border-gray-300 checked:bg-gray-300 checked:bg-none checked:hover:border-gray-300 checked:hover:bg-gray-300 checked:hover:bg-none checked:focus:border-gray-300 checked:focus:bg-gray-300 checked:focus:bg-none',
        unChecked: 'cursor-not-allowed border-neutral-400 bg-white',
      },
    },
    size: {
      lg: 'size-[20px]',
      sm: 'size-[16px]',
    },
  });

  const radioClassName = classnames(
    'block rounded-full border focus:shadow-dark focus:ring-transparent focus:ring-offset-0',
    resolveRadioVariant(`intent.${disabledVariant}.${checkedVariant}`) as string,
    resolveRadioVariant(`size.${size}`) as string,
  );

  const resolveLabelVariant = cva({
    intent: {
      active: '',
      disabled: {
        checked: 'text-gray-300',
        unChecked: 'text-neutral-400',
      },
    },
  });

  const labelClassName = classnames(
    'text-14',
    resolveLabelVariant(`intent.${disabledVariant}.${checkedVariant}`) as string,
  );

  const resolveDotVariant = cva({
    intent: {
      active: {
        checked: 'bg-primary',
        unChecked: 'hidden',
      },
      disabled: {
        checked: 'bg-white',
        unChecked: 'hidden',
      },
    },
  });

  const dotClassName = classnames(
    'absolute left-1/2 top-1/2 block size-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full',
    resolveDotVariant(`intent.${disabledVariant}.${checkedVariant}`) as string,
  );

  return { radioClassName, labelClassName, dotClassName };
};

export default useClassNames;
