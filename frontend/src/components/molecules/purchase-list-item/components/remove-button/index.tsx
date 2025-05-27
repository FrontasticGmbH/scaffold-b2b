import React from 'react';
import { useTranslations } from 'use-intl';
import { Props } from './types';

const RemoveButton = ({ onRemove }: Props) => {
  const translate = useTranslations();

  return (
    <button className="text-14 font-medium text-primary underline transition hover:text-gray-500" onClick={onRemove}>
      {translate('common.remove')}
    </button>
  );
};

export default RemoveButton;
