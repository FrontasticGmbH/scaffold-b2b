'use client';

import React, { useCallback, useRef } from 'react';
import { classnames } from '@/utils/classnames/classnames';
import useControllableState from '@/hooks/useControllableState';
import useResizeObserver from '@/hooks/useResizeObserver';
import useVariant from './hooks/useVariant';
import useClassNames from './hooks/useClassNames';
import { TextAreaProps } from './types';
import Label from '../label';

const TextArea = ({
  value: valueProp,
  defaultValue,
  onChange,
  label = '',
  disabled = false,
  readOnly = false,
  valid = false,
  error = '',
  required = false,
  showOptionalLabel = false,
  requiredStyle = 'asterisk',
  className = '',
  fitContent = false,
  ...props
}: TextAreaProps) => {
  const [value, setValue] = useControllableState(valueProp, defaultValue);

  const ref = useRef<HTMLTextAreaElement>(null) as React.MutableRefObject<HTMLTextAreaElement>;

  const variant = useVariant({ disabled, readOnly, valid, error });

  const { textAreaClassName } = useClassNames(variant, { fitContent });

  const handleFitContent = useCallback(() => {
    if (fitContent && ref.current) {
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [fitContent]);

  const { ref: resizeRef } = useResizeObserver(handleFitContent);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      handleFitContent();
      setValue(e.target.value);
      onChange?.(e);
    },
    [onChange, setValue, handleFitContent],
  );

  return (
    <div>
      <Label required={required} showOptionalLabel={showOptionalLabel} requiredStyle={requiredStyle}>
        {label}
      </Label>

      <textarea
        ref={(r) => {
          ref.current = r as HTMLTextAreaElement;
          resizeRef.current = r as HTMLTextAreaElement;
        }}
        className={classnames(textAreaClassName, className)}
        value={value}
        readOnly={readOnly}
        disabled={disabled}
        required={required}
        onChange={handleChange}
        {...props}
      />

      {error && <span className="mt-3 block text-12 font-medium text-red-500">{error}</span>}
    </div>
  );
};

export default TextArea;
