import React, { useCallback, useEffect, useState } from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import useControllableState from '@/hooks/useControllableState';
import { classnames } from '@/utils/classnames/classnames';
import { Props } from './types';
import Input from '../input';

const QuantityWidget = ({
  value: valueProp,
  defaultValue = 0,
  minValue = 0,
  maxValue = Number.MAX_VALUE,
  onChange,
  disabled,
  showLabel = true,
}: Props) => {
  const { translate } = useTranslation();

  const [value, setValue] = useControllableState(valueProp, Math.min(defaultValue, maxValue));
  const [rawValue, setRawValue] = useState(value.toString());

  const handleDecrement = useCallback(() => {
    const newValue = Math.max(minValue, value - 1);

    setValue(newValue);
    onChange?.(newValue);
  }, [value, minValue, setValue, onChange]);

  const handleIncrement = useCallback(() => {
    const newValue = Math.min(maxValue, value + 1);

    setValue(newValue);
    onChange?.(newValue);
  }, [value, maxValue, setValue, onChange]);

  useEffect(() => {
    setRawValue(value.toString());
  }, [value]);

  const handleRawValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '' || !isNaN(+value)) setRawValue(value);
  }, []);

  const handleRawValueSubmit = useCallback(() => {
    const number = Math.max(minValue, Math.min(maxValue, +rawValue));

    setValue(number);
    onChange?.(number);
    setRawValue(number.toString());
  }, [rawValue, minValue, maxValue, onChange, setValue]);

  const boxClassName = classnames('flex size-[40px] items-center justify-center p-0');

  const buttonClassName = classnames(
    'border-gray-300 bg-white transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:hover:bg-white',
  );

  return (
    <div className="flex items-center gap-3">
      {showLabel && <span className="text-14 text-gray-700">{translate('common.quantity.shorthand')}</span>}
      <div className="flex overflow-hidden rounded-md border border-gray-300 text-gray-700">
        <button
          disabled={value <= minValue || disabled}
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
            disabled={disabled}
          />
        </form>
        <button
          disabled={value >= maxValue || disabled}
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
