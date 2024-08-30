import React from 'react';
import { Listbox } from '@headlessui/react';
import { classnames } from '@/utils/classnames/classnames';
import Checkbox from '@/components/atoms/checkbox';
import { Props } from './types';
import { useDropdown } from '../../context';

const DropdownOption = ({ children, value }: React.PropsWithChildren<Props>) => {
  const { value: selectedValue, defaultValue } = useDropdown();

  const isActive = !!(value && (selectedValue?.includes(value) || defaultValue?.includes(value)));

  return (
    <Listbox.Option key={value} className={classnames('relative cursor-default select-none')} value={value}>
      <div
        className={classnames(
          'flex items-center justify-between gap-5 truncate px-3 py-[10px] text-14 text-gray-700 hover:bg-neutral-200 lg:py-1',
          {
            'bg-neutral-200': isActive,
          },
        )}
      >
        {children}
        <Checkbox checked={isActive} />
      </div>
    </Listbox.Option>
  );
};

export default DropdownOption;
