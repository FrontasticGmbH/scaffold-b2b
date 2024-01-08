'use client';

import React, { useCallback } from 'react';
import { classnames } from '@/utils/classnames/classnames';
import useControllableState from '@/hooks/useControllableState';
import { CheckboxProps } from './types';
import useClassNames from './hooks/useClassNames';
import styles from './styles/index.module.css';

const Checkbox = ({
  label,
  checked: checkedProp,
  onChecked,
  disabled,
  containerClassName,
  className,
  defaultChecked,
  size = 'lg',
  ...props
}: CheckboxProps) => {
  const [checked, setChecked] = useControllableState(checkedProp, defaultChecked);

  const { checkboxClassName, labelClassName, containerClassNames } = useClassNames({
    checked,
    size,
    disabled,
    containerClassName,
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(e.target.checked);
      onChecked?.(e.target.checked);
    },
    [onChecked, setChecked],
  );

  return (
    <label className={containerClassNames}>
      <input
        type="checkbox"
        className={classnames(checkboxClassName, className, styles.checkbox)}
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
        {...props}
      />
      <span className={labelClassName}>{label}</span>
    </label>
  );
};

export default Checkbox;
