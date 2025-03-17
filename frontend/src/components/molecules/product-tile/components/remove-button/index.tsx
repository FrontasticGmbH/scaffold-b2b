import React from 'react';
import { useTranslations } from 'use-intl';
import { Props } from './types';

const RemoveButton = ({ onRemove }: Props) => {
  const translate = useTranslations();

  return (
    <span className="cursor-pointer text-14 font-medium text-primary" onClick={onRemove}>
      {translate('common.remove')}
    </span>
  );
};

export default RemoveButton;
