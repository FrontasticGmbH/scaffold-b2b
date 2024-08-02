import React, { useCallback, useContext } from 'react';
import useControllableState from '@/hooks/useControllableState';
import useDisclosure from '@/hooks/useDisclosure';
import { DropdownContextShape, Props } from './types';

export const DropdownContext = React.createContext({} as DropdownContextShape);

const DropdownProvider = ({
  children,
  value: { size, disabled, onChange, value: valueProp, className, defaultValue },
}: React.PropsWithChildren<Props>) => {
  const { isOpen: isExpanded, onOpen: onExpand, onClose: onCollapse, onToggle } = useDisclosure();

  const [value, setValue] = useControllableState(valueProp, []);

  const handleChange = useCallback(
    (value: string[]) => {
      onChange?.(value);
      setValue(value);
      onCollapse();
    },
    [onChange, setValue, onCollapse],
  );

  return (
    <DropdownContext.Provider
      value={{
        size,
        disabled,
        handleChange,
        value,
        className,
        defaultValue,
        isExpanded,
        onExpand,
        onCollapse,
        onToggle,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
};

export default DropdownProvider;

export const useDropdown = () => useContext(DropdownContext);
