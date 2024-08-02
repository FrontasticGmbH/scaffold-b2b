'use client';

import React from 'react';
import { DropdownProps } from './types';
import DropdownProvider from './context';
import DropdownContainer from './components/container';
import DropdownButton from './components/button';
import DropdownOptions from './components/options';
import DropdownOption from './components/option';

const MultiDropdown: React.FC<React.PropsWithChildren<DropdownProps>> & {
  Button: typeof DropdownButton;
  Options: typeof DropdownOptions;
  Option: typeof DropdownOption;
} = ({ children, value, defaultValue, onChange, disabled, className, size = 'lg' }) => {
  return (
    <DropdownProvider value={{ onChange, value, defaultValue, disabled, className, size }}>
      <DropdownContainer>{children}</DropdownContainer>
    </DropdownProvider>
  );
};

MultiDropdown.Button = DropdownButton;
MultiDropdown.Options = DropdownOptions;
MultiDropdown.Option = DropdownOption;

export default MultiDropdown;
