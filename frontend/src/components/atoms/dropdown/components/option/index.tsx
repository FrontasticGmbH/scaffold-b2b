import React from 'react';
import { Listbox } from '@headlessui/react';
import { classnames } from '@/utils/classnames/classnames';
import { Props } from './types';

const DropdownOption = ({ children, value }: React.PropsWithChildren<Props>) => {
  return (
    <Listbox.Option
      key={value}
      className={({ active, selected }) =>
        classnames('relative block cursor-default select-none truncate px-3 py-[10px] text-14 text-gray-700 lg:py-1', {
          'bg-neutral-100': active,
          'bg-neutral-200': selected,
        })
      }
      value={{ value }}
    >
      {children}
    </Listbox.Option>
  );
};

export default DropdownOption;
