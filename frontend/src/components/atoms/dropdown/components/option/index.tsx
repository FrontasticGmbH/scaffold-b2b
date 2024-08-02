import React from 'react';
import { Listbox } from '@headlessui/react';
import { classnames } from '@/utils/classnames/classnames';
import { Props } from './types';
import { useDropdown } from '../../context';

const DropdownOption = ({ children, value }: React.PropsWithChildren<Props>) => {
  const { value: selectedValue, defaultValue } = useDropdown();

  const isActive = value === selectedValue || value === defaultValue;

  return (
    <Listbox.Option key={value} className={classnames('relative cursor-default select-none')} value={{ value }}>
      <div
        className={classnames('block truncate px-3 py-[10px] text-14 text-gray-700 lg:py-1', {
          'bg-neutral-200': isActive,
        })}
      >
        {children}
      </div>
    </Listbox.Option>
  );
};

export default DropdownOption;
