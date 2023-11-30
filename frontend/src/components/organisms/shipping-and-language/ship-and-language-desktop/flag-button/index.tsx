import React from 'react';
import FlagIcons from '@/components/atoms/icons/flag-icons';
import Typography from '@/components/atoms/typography';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { FlagButtonProps } from '../../types';

const FlagButton = ({ selectedShip, selectedLanguage, onOpen }: FlagButtonProps) => {
  return (
    <>
      {selectedShip && selectedLanguage && (
        <div
          className="flex cursor-pointer items-center justify-center text-14 font-normal text-white underline-offset-4 hover:underline"
          onClick={onOpen}
        >
          <FlagIcons name={selectedShip.flagName} className="mr-1 h-fit w-5 rounded-full border border-white" />
          <Typography fontSize={14} className="ml-1">{`/ ${
            selectedShip.languages.length > 0
              ? selectedLanguage.name.split(' ')[0]
              : selectedShip.languages
                  .find((language) => language.value === selectedShip.defaultLanguage)
                  ?.name.split(' ')[0]
          }`}</Typography>
          <ChevronDownIcon className="ml-1 w-4 text-white" />
        </div>
      )}
    </>
  );
};

export default FlagButton;
