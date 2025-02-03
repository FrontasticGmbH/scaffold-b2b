import React from 'react';
import { Listbox } from '@headlessui/react';
import { ChevronDownIcon as ArrowIcon } from '@heroicons/react/24/solid';
import { classnames } from '@/utils/classnames/classnames';
import useClassNames from '../../hooks/useClassNames';
import { useDropdown } from '../../context';
import { Props } from './types';

const DropdownButton = ({ children, className }: Props) => {
  const { disabled, size, value, defaultValue } = useDropdown();

  const { buttonClassName } = useClassNames({ disabled, size });

  return (
    <Listbox.Button data-testid="dropdown-button" className={classnames(className, buttonClassName)}>
      {({ open }) => (
        <div>
          <div className="block truncate">
            {typeof children === 'function'
              ? children({ selected: { value: value ?? defaultValue }, isExpanded: open })
              : children}
          </div>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ArrowIcon className="h-[18px]" aria-hidden="true" />
          </span>
        </div>
      )}
    </Listbox.Button>
  );
};

export default DropdownButton;
