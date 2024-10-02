import { classnames } from '@/utils/classnames/classnames';
import { cva } from '@/utils/classnames/cva';
import { CheckboxProps } from '../../types';

const useClassNames = ({
  checked,
  size,
  disabled,
  containerClassName,
}: Pick<CheckboxProps, 'checked' | 'size' | 'disabled' | 'containerClassName'>) => {
  const checkedVariant = checked ? 'checked' : 'unChecked';
  const disabledVariant = disabled ? 'disabled' : 'active';

  const resolveCheckboxVariant = cva({
    intent: {
      active: {
        checked:
          'cursor-pointer border-primary bg-primary checked:border-primary checked:bg-primary checked:hover:border-primary checked:hover:bg-primary checked:focus:border-primary checked:focus:bg-primary',
        unChecked: 'cursor-pointer border-gray-300 bg-white hover:border-gray-600',
      },
      disabled: {
        checked:
          'cursor-not-allowed border-gray-300 bg-gray-300 checked:border-gray-300 checked:bg-gray-300 checked:hover:border-gray-300 checked:hover:bg-gray-300 checked:focus:border-gray-300 checked:focus:bg-gray-300',
        unChecked: 'cursor-not-allowed border-neutral-400 bg-white',
      },
    },
    size: {
      lg: 'size-[20px]',
      sm: 'size-[16px]',
    },
  });

  const checkboxClassName = classnames(
    'rounded-sm border focus:shadow-dark focus:ring-transparent focus:ring-offset-0',
    resolveCheckboxVariant(`intent.${disabledVariant}.${checkedVariant}`) as string,
    resolveCheckboxVariant(`size.${size}`) as string,
  );

  const resolveLabelVariant = cva({
    intent: {
      active: { checked: 'text-gray-600', unChecked: 'text-gray-600' },
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

  const containerClassNames = classnames('flex w-fit items-center gap-2', containerClassName);

  return { checkboxClassName, labelClassName, containerClassNames };
};

export default useClassNames;
