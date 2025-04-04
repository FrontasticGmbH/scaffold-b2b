import React from 'react';
import FlagIcons from '@/components/atoms/icons/flag-icons';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { FlagButtonProps } from '../../types';

const FlagButton = ({ selectedShip, selectedLanguage, onOpen }: FlagButtonProps) => {
  return (
    <>
      {selectedShip && selectedLanguage && (
        <button
          className="flex cursor-pointer items-center justify-center p-1 text-14 font-normal text-white"
          onClick={onOpen}
        >
          <FlagIcons name={selectedShip.flagName} className="mr-1 rounded-full border border-white" />
          <span className="ml-1 text-14 underline-offset-4 hover:underline">{`/ ${
            selectedShip.languages.length > 0
              ? selectedLanguage.name.split(' ')[0]
              : selectedShip.languages
                  .find((language) => language.value === selectedShip.defaultLanguage)
                  ?.name.split(' ')[0]
          }`}</span>
          <ChevronDownIcon className="ml-1 w-4 text-white" />
        </button>
      )}
    </>
  );
};

export default FlagButton;
