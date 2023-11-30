import React, { useCallback, useState } from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import useControllableState from '@/hooks/useControllableState';
import { classnames } from '@/utils/classnames/classnames';
import { Props } from './types';
import Input from '../input';

const QuantityWidget = ({ value: valueProp, defaultValue = 0, maxValue, onChange, showLabel = true }: Props) => {
  const { translate } = useTranslation();

  const [value, setValue] = useControllableState(valueProp, defaultValue);
  const [rawValue, setRawValue] = useState(value.toString());

  const handleDecrement = useCallback(() => {
    if (value === 0) return;

    const newValue = value - 1;

    setValue(newValue);
    setRawValue(newValue.toString());
    onChange?.(newValue);
  }, [value, setValue, onChange]);

  const handleIncrement = useCallback(() => {
    if (value === maxValue) return;

    const newValue = value + 1;

    setValue(newValue);
    setRawValue(newValue.toString());
    onChange?.(newValue);
  }, [value, setValue, onChange, maxValue]);

  const handleRawValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '' || !isNaN(+value)) setRawValue(value);
  }, []);

  const handleRawValueSubmit = useCallback(() => {
    if (isNaN(+rawValue)) return;

    const number = Math.max(0, Math.min(maxValue ?? Number.MAX_VALUE, +rawValue));

    setValue(number);
    onChange?.(number);
  }, [rawValue, maxValue, onChange, setValue]);

  const boxClassName = classnames('flex h-[40px] w-[40px] items-center justify-center p-0');

  const buttonClassName = classnames(
    'border-gray-300 bg-white transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400',
  );

  return (
    <div className="flex items-center gap-3">
      {showLabel && <span className="text-14 text-gray-700">{translate('common.quantity.shorthand')}</span>}
      <div className="flex overflow-hidden rounded-md border border-gray-300 text-gray-700">
        <button
          disabled={value <= 0}
          className={classnames(boxClassName, buttonClassName, 'border-r')}
          onClick={handleDecrement}
        >
          -
        </button>
        <form
          className={boxClassName}
          onSubmit={(e) => {
            e.preventDefault();
            handleRawValueSubmit();
          }}
        >
          <Input
            unStyled
            className="text-center text-14"
            value={rawValue}
            onChange={handleRawValueChange}
            onBlur={handleRawValueSubmit}
          />
        </form>
        <button
          disabled={value >= (maxValue ?? Number.MAX_VALUE)}
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
