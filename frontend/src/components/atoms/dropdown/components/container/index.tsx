import React from 'react';
import { classnames } from '@/utils/classnames/classnames';
import { Listbox } from '@headlessui/react';
import { useDropdown } from '../../context';

const DropdownContainer = ({ children }: React.PropsWithChildren) => {
  const { handleChange, className, value, disabled, defaultValue } = useDropdown();

  return (
    <div className={classnames('relative', className)}>
      <Listbox value={value} defaultValue={defaultValue} onChange={handleChange} disabled={disabled}>
        {children}
      </Listbox>
    </div>
  );
};

export default DropdownContainer;
