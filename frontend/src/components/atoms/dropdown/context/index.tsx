import useControllableState from '@/hooks/useControllableState';
import React, { useCallback, useContext } from 'react';
import { Option } from '../types';
import { DropdownContextShape, Props } from './types';

export const DropdownContext = React.createContext({} as DropdownContextShape);

const DropdownProvider = ({
  children,
  value: { size, disabled, onChange, value: valueProp, className, defaultValue },
}: React.PropsWithChildren<Props>) => {
  const [value, setValue] = useControllableState(valueProp);

  const handleChange = useCallback(
    (valueOrOption: string | Option) => {
      const newValue = typeof valueOrOption === 'string' ? valueOrOption : valueOrOption.value;
      onChange?.(newValue);
      setValue(newValue);
    },
    [onChange, setValue],
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
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
};

export default DropdownProvider;

export const useDropdown = () => useContext(DropdownContext);
