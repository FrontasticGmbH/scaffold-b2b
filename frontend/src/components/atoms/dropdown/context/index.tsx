import React, { useCallback, useContext } from 'react';
import useControllableState from '@/hooks/useControllableState';
import { DropdownContextShape, Props } from './types';
import { Option } from '../types';

export const DropdownContext = React.createContext({} as DropdownContextShape);

const DropdownProvider = ({
  children,
  value: { size, disabled, onChange, value: valueProp, className, defaultValue },
}: React.PropsWithChildren<Props>) => {
  const [value, setValue] = useControllableState(valueProp);

  const handleChange = useCallback(
    ({ value }: Option) => {
      onChange?.(value);
      setValue(value);
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
