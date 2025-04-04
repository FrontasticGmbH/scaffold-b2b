import React from 'react';
import Select from '@/components/atoms/select';
import Input from '@/components/atoms/input';
import { Props } from './types';

const ValueSelector = ({ criteria, className, value, disabled, onChange }: Props) => {
  if (!criteria) return <></>;

  if (!criteria.type || criteria.type === 'text')
    return (
      <Input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        outerContainerClassName={className}
        data-testid="value-selector-input"
      />
    );

  return (
    <Select
      options={criteria.values ?? []}
      value={value}
      className={className}
      disabled={disabled}
      onChange={onChange}
    />
  );
};

export default ValueSelector;
