import React, { useCallback } from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import useControllableState from '@/hooks/useControllableState';
import { classnames } from '@/utils/classnames/classnames';
import { Props } from './types';

const QuantityWidget = ({ value: valueProp, defaultValue = 0, maxValue, onChange, showLabel = true }: Props) => {
  const { translate } = useTranslation();

  const [value, setValue] = useControllableState(valueProp, defaultValue);

  const handleDecrement = useCallback(() => {
    if (value === 0) return;

    setValue(value - 1);
    onChange?.(value - 1);
  }, [value, setValue, onChange]);

  const handleIncrement = useCallback(() => {
    if (value === maxValue) return;

    setValue(value + 1);
    onChange?.(value + 1);
  }, [value, setValue, onChange, maxValue]);

  const boxClassName = classnames('flex h-[40px] w-[40px] items-center justify-center p-0');

  const buttonClassName = classnames(
    'border-gray-300 bg-white transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400',
  );

  return (
    <div className="flex items-center gap-3">
      {showLabel && <span className="text-14 text-gray-700">{translate('common.quantity.shorthand')}</span>}
      <div className="flex overflow-hidden rounded-md border border-gray-300 text-gray-700">
        <button
          disabled={value === 0}
          className={classnames(boxClassName, buttonClassName, 'border-r')}
          onClick={handleDecrement}
        >
          -
        </button>
        <div className={classnames(boxClassName, 'text-14')}>{value}</div>
        <button
          disabled={value === maxValue}
          className={classnames(boxClassName, buttonClassName, 'border-l')}
          onClick={handleIncrement}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantityWidget;
