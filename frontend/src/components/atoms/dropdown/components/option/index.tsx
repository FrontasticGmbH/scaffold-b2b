import React from 'react';
import { ListboxOption } from '@headlessui/react';
import { classnames } from '@/utils/classnames/classnames';
import { Props } from './types';

const DropdownOption = ({ children, value }: React.PropsWithChildren<Props>) => {
  return (
    <ListboxOption
      key={value}
      className={({ focus, selected }) =>
        classnames('relative block cursor-default select-none truncate px-3 py-[10px] text-14 text-gray-700 lg:py-1', {
          'bg-neutral-100': focus,
          'bg-neutral-200': selected,
        })
      }
      value={{ value }}
    >
      {children}
    </ListboxOption>
  );
};

export default DropdownOption;
