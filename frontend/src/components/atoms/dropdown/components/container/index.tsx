import React from 'react';
import { classnames } from '@/utils/classnames/classnames';
import { Listbox } from '@headlessui/react';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import { useDropdown } from '../../context';

const DropdownContainer = ({ children }: React.PropsWithChildren) => {
  const { handleChange, className, value, disabled, defaultValue, onCollapse } = useDropdown();

  const { ref } = useOnClickOutside(onCollapse);

  return (
    <div ref={ref} className={classnames('relative', className)}>
      <Listbox value={value ?? {}} defaultValue={defaultValue} onChange={handleChange} disabled={disabled}>
        {children}
      </Listbox>
    </div>
  );
};

export default DropdownContainer;
