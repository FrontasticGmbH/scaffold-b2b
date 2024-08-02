import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { classnames } from '@/utils/classnames/classnames';
import { useDropdown } from '../../context';
import { Props } from './types';

const DropdownOptions = ({ children, className }: React.PropsWithChildren<Props>) => {
  const { isExpanded } = useDropdown();

  return (
    <Transition
      show={isExpanded}
      as={Fragment}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Listbox.Options
        static
        className={classnames(
          'absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md bg-white py-1 text-base shadow-400 focus:outline-none',
          className,
        )}
      >
        {children}
      </Listbox.Options>
    </Transition>
  );
};

export default DropdownOptions;
