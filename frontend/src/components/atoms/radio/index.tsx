'use client';

import React, { useCallback } from 'react';
import useControllableState from '@/hooks/useControllableState';
import { classnames } from '@/utils/classnames/classnames';
import { RadioProps } from './types';
import useClassNames from './hooks/useClassNames';

const Radio = ({ label, checked: checkedProp, onSelected, disabled, className, size = 'lg', ...props }: RadioProps) => {
  const [checked, setChecked] = useControllableState(checkedProp);

  const { radioClassName, labelClassName, dotClassName } = useClassNames({ checked, disabled, size });

  const handleChange = useCallback(() => {
    setChecked(true);
    onSelected?.();
  }, [setChecked, onSelected]);

  return (
    <label className="flex w-fit items-center gap-2">
      <div className="relative w-fit">
        <input
          type="radio"
          className={classnames(radioClassName, className)}
          disabled={disabled}
          checked={checked}
          onChange={handleChange}
          {...props}
        />
        <span className={dotClassName}></span>
      </div>
      <span className={labelClassName}>{label}</span>
    </label>
  );
};

export default Radio;
