import React from 'react';
import { Listbox } from '@headlessui/react';
import { classnames } from '@/utils/classnames/classnames';
import { Props } from './types';
import { useDropdown } from '../../context';

const DropdownOption = ({ children, value }: React.PropsWithChildren<Props>) => {
  const { value: selectedValue, defaultValue } = useDropdown();

  return (
    <Listbox.Option
      key={value}
      className={({ active }) => classnames('relative cursor-default select-none', { 'bg-neutral-200': active })}
      value={{ value }}
    >
      <div
        className={classnames('block truncate p-2 text-14 text-gray-700', {
          'bg-neutral-200': value === selectedValue || value === defaultValue,
        })}
      >
        {children}
      </div>
    </Listbox.Option>
  );
};

export default DropdownOption;
