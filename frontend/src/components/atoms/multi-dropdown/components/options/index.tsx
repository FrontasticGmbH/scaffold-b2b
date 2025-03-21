import React from 'react';
import { ListboxOptions, Transition } from '@headlessui/react';
import { classnames } from '@/utils/classnames/classnames';
import { useDropdown } from '../../context';
import { Props } from './types';

const DropdownOptions = ({ children, className }: React.PropsWithChildren<Props>) => {
  const { isExpanded } = useDropdown();

  return (
    <Transition show={isExpanded} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
      <ListboxOptions
        static
        className={classnames(
          'absolute z-50 mt-1 max-h-60 w-full min-w-fit overflow-y-auto rounded-md bg-white py-1 text-base shadow-400 focus:outline-none',
          className,
        )}
      >
        {children}
      </ListboxOptions>
    </Transition>
  );
};

export default DropdownOptions;
