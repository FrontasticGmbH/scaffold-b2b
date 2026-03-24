'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations } from 'use-intl';
import { classnames } from '@/utils/classnames/classnames';

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from '@headlessui/react';

import { ChevronDownIcon } from '@heroicons/react/24/solid';
import useControllableState from '@/hooks/useControllableState';
import { SelectProps } from './types';
import Label from '../label';

const Select = ({
  label,
  required,
  requiredStyle = 'asterisk',
  showOptionalLabel = false,
  options = [],
  placeholder = '',
  enableSearch = false,
  value,
  onChange,
  disabled = false,
  className,
  defaultValue,
  testId,
  error,
}: SelectProps) => {
  const translate = useTranslations();

  const [search, setSearch] = useState('');
  const [dropdownValue, setDropdownValue] = useControllableState(value, defaultValue);

  const filteredOptions = useMemo(() => {
    if (!enableSearch || !search) return options;

    return options.filter(({ name }) => name.toLowerCase().includes(search.toLowerCase()));
  }, [options, search, enableSearch]);

  const id = typeof label === 'string' ? label.split(' ').join('-').toLocaleLowerCase() : 'select';

  return (
    <Combobox
      immediate
      value={dropdownValue}
      onClose={() => setSearch('')}
      onChange={(inputValue: string) => {
        setDropdownValue(inputValue);
        onChange?.(inputValue);
      }}
      as="div"
      className={classnames('relative', className)}
      disabled={disabled}
    >
      <Label
        htmlFor={`${id}-select`}
        required={required}
        requiredStyle={requiredStyle}
        showOptionalLabel={showOptionalLabel}
      >
        {label}
      </Label>

      <div className="relative">
        <ComboboxInput
          readOnly={!enableSearch}
          displayValue={(item: string) => {
            return options.find(({ value }) => value === item)?.name as string;
          }}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={placeholder}
          className={classnames(
            className,
            'w-full rounded-md border border-gray-300 pl-3 pr-10 text-left text-14 focus:border-neutral-800 focus:outline-none focus:ring-0 active:border-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-200',
            { 'border-red-500': !!error },
          )}
          aria-label={!label ? translate('common.select') : ''}
          data-testid={testId}
          id={`${id}-select`}
        />
        <ComboboxButton
          aria-label="Dropdown button"
          data-testid="dropdown-button"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <ChevronDownIcon className="h-[18px]" aria-hidden="true" />
        </ComboboxButton>
      </div>
      {error && <span className="mt-3 block text-12 font-medium text-red-500">{error}</span>}

      <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
        <ComboboxOptions
          className={classnames(
            'absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md bg-white py-1 text-base shadow-400 focus:outline-none',
            className,
          )}
        >
          {enableSearch && filteredOptions.length === 0 && (
            <p className="px-3 py-2 text-14 text-gray-500">{translate('common.no-results-found')}</p>
          )}
          {filteredOptions.map(({ name, value }) => (
            <ComboboxOption
              aria-label={name}
              className={({ focus, selected }) =>
                classnames(
                  'relative block cursor-default select-none truncate px-3 py-[10px] text-14 text-gray-700 lg:py-1',
                  {
                    'bg-neutral-100': focus,
                    'bg-neutral-200': selected,
                  },
                )
              }
              key={`${name}-${value}`}
              value={value}
            >
              {name}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Transition>
    </Combobox>
  );
};

export default Select;
