'use client';

import React, { useMemo, useState } from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { classnames } from '@/utils/classnames/classnames';
import { SelectProps } from './types';
import Dropdown from '../multi-dropdown';
import Label from '../label';
import Input from '../input';

const MultiSelect = ({
  label,
  required,
  requiredStyle = 'asterisk',
  showOptionalLabel = false,
  options = [],
  placeholder = '',
  enableSearch = false,
  menuTop,
  ...props
}: SelectProps) => {
  const { translate } = useTranslation();

  const [search, setSearch] = useState('');

  const filteredOptions = useMemo(() => {
    if (!enableSearch || !search) return options;

    return options.filter(({ name }) => name.toLowerCase().includes(search.toLowerCase()));
  }, [options, search, enableSearch]);

  return (
    <Dropdown {...props}>
      <Label required={required} requiredStyle={requiredStyle} showOptionalLabel={showOptionalLabel}>
        {label}
      </Label>

      <Dropdown.Button>
        {({ selected, isExpanded }) => {
          if (!enableSearch || !isExpanded)
            return (
              selected?.map((s) => options.find((option) => option.value === s.value)?.name).join(', ') ?? placeholder
            );

          return (
            <Input
              unStyled
              focusOnMount
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.key === ' ' && e.stopPropagation()}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          );
        }}
      </Dropdown.Button>
      <Dropdown.Options className={classnames({ 'bottom-12 shadow-500-reverse': menuTop })}>
        {enableSearch && filteredOptions.length === 0 && (
          <p className="px-3 py-2 text-14 text-gray-500">{translate('common.no.results.found')}</p>
        )}
        {filteredOptions.map(({ name, value }) => (
          <Dropdown.Option key={value} value={value}>
            {name}
          </Dropdown.Option>
        ))}
      </Dropdown.Options>
    </Dropdown>
  );
};

export default MultiSelect;
