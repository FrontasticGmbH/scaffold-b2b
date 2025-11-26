'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { CheckIcon as ValidIcon, XMarkIcon as ClearIcon } from '@heroicons/react/24/solid';
import { classnames } from '@/utils/classnames/classnames';
import useControllableState from '@/hooks/useControllableState';
import useDisclosure from '@/hooks/useDisclosure';
import { InformationCircleIcon as ErrorIcon, CheckCircleIcon as SuccessIcon } from '@heroicons/react/24/outline';
import useVariant from './hooks/useVariant';
import Label from '../label';
import { InputProps } from './types';
import useClassNames from './hooks/useClassNames';

const Input = (
  {
    icon,
    value: valueProp,
    onChange,
    onClear,
    optionalLabel,
    onFocus: onFocusProp,
    onBlur: onBlurProp,
    label = '',
    disabled = false,
    readOnly = false,
    valid = false,
    showValidIcon = true,
    error = '',
    success = '',
    required = false,
    clearButton = false,
    showOptionalLabel = false,
    requiredStyle = 'asterisk',
    className = '',
    containerClassName = '',
    outerContainerClassName = '',
    unStyled = false,
    focusOnMount = false,
    ...props
  }: InputProps,
  forwardedRef: React.ForwardedRef<HTMLInputElement>,
) => {
  const [value, setValue] = useControllableState(valueProp, '');

  const { isOpen: isFocused, onOpen: onFocus, onClose: onBlur } = useDisclosure();

  const ref = useRef<HTMLInputElement>(null);

  const mounted = useRef(false);

  const variant = useVariant({ disabled, readOnly, valid, error });

  const { inputClassName, containerClassName: defaultContainerClassName } = useClassNames(variant, isFocused, unStyled);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      onChange?.(e);
    },
    [onChange, setValue],
  );

  const handleClear = useCallback(() => {
    setValue('');
    onClear?.();
  }, [onClear, setValue]);

  useEffect(() => {
    if (focusOnMount && !mounted.current) setTimeout(() => ref.current?.focus());
    mounted.current = true;
  }, [focusOnMount]);

  return (
    <div className={outerContainerClassName}>
      <Label
        required={required}
        showOptionalLabel={showOptionalLabel}
        optionalLabel={optionalLabel}
        requiredStyle={requiredStyle}
        htmlFor={props.id || props.name}
      >
        {label}
      </Label>

      <div className={classnames(containerClassName, defaultContainerClassName)}>
        <input
          ref={(r) => {
            ref.current = r;

            if (typeof forwardedRef === 'function') forwardedRef(r);
            else if (forwardedRef) forwardedRef.current = r;
          }}
          className={classnames(inputClassName, className)}
          value={value}
          readOnly={readOnly}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          onFocus={(e) => {
            onFocus();
            onFocusProp?.(e);
          }}
          onBlur={(e) => {
            onBlur();
            onBlurProp?.(e);
          }}
          {...props}
          id={props.id || props.name}
        />
        {(clearButton || valid || icon) && (
          <div className="flex items-center justify-center px-3">
            {clearButton && (
              <ClearIcon
                data-testid={'clear-button'}
                width={16}
                height={16}
                className="cursor-pointer text-gray-700"
                onClick={handleClear}
              />
            )}
            {valid && showValidIcon && (
              <ValidIcon data-testid="valid-icon" width={16} height={16} className="text-green-500" />
            )}
            {icon && <span className="text-gray-700">{icon}</span>}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-1 text-14 text-red-500">
          <ErrorIcon className="size-5 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="mt-3 flex items-start gap-1 text-14 text-green-500">
          <SuccessIcon className="size-5 shrink-0" />
          {success}
        </div>
      )}
    </div>
  );
};

export default React.forwardRef(Input);
