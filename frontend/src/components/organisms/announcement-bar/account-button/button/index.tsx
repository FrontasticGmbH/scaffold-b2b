import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { ButtonProps } from '../../types';

const ButtonElement = ({ onOpen }: ButtonProps) => {
  const { translate } = useTranslation();
  return (
    <div
      className="flex cursor-pointer items-center justify-center text-14 font-normal text-white underline-offset-4 hover:underline"
      onClick={onOpen}
    >
      {translate('account.my.account')}
      <ChevronDownIcon className="ml-1 size-4 text-white" />
    </div>
  );
};

export default ButtonElement;
