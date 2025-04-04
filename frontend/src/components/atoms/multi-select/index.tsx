'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations } from 'use-intl';
import { classnames } from '@/utils/classnames/classnames';
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  Transition,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { SelectProps } from './types';
import Label from '../label';
import Checkbox from '../checkbox';

const MultiSelect = ({
  label,
  required,
  requiredStyle = 'asterisk',
  showOptionalLabel = false,
  options = [],
  placeholder = '',
  enableSearch = false,

  disabled,
  className,
  onChange,
  value = [],
  defaultValue,
}: SelectProps) => {
  const translate = useTranslations();

  const [search, setSearch] = useState('');
  const [dropdownValue, setDropdownValue] = useState(defaultValue || value);

  const filteredOptions = useMemo(() => {
    if (!enableSearch || !search) return options;

    return options.filter(({ name }) => name.toLowerCase().includes(search.toLowerCase()));
  }, [options, search, enableSearch]);

  return (
    <Combobox
      as="div"
      className={classnames('relative', className)}
      immediate
      onClose={() => setSearch('')}
      onChange={(inputValue) => {
        setDropdownValue(inputValue);
        onChange?.(inputValue);
      }}
      multiple
      value={dropdownValue}
      disabled={disabled}
    >
      {({ open }) => (
        <>
          <Label required={required} requiredStyle={requiredStyle} showOptionalLabel={showOptionalLabel}>
            {label}
          </Label>

          <div className="relative">
            <ComboboxInput
              readOnly={!enableSearch}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={placeholder}
              className={classnames(
                className,
                'w-full rounded-md border border-gray-300 pl-3 pr-10 text-left text-14 focus:border-neutral-800 focus:outline-none focus:ring-0 active:border-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-200',
              )}
              displayValue={(items: string[]) => {
                if (open && enableSearch) return search;

                const selectedValues = options.reduce((acc, curr) => {
                  if (items.includes(curr.value)) {
                    return acc.length ? `${acc}, ${curr.name}` : curr.name;
                  }
                  return acc;
                }, '');
                return selectedValues;
              }}
              aria-label={!label ? translate('common.select') : ''}
            />
            <ComboboxButton
              aria-label="Dropdown button"
              data-testid="dropdown-button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <ChevronDownIcon className="h-[18px]" aria-hidden="true" />
            </ComboboxButton>
          </div>

          <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <ComboboxOptions
              className={classnames(
                'absolute z-50 mt-1 max-h-60 min-w-full overflow-y-auto rounded-md bg-white py-1 text-base shadow-400 focus:outline-none',
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
                  {({ selected }) => (
                    <div className="flex justify-between gap-2">
                      {name}
                      <Checkbox checked={selected} />
                    </div>
                  )}
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          </Transition>
        </>
      )}
    </Combobox>
  );
};

export default MultiSelect;
