import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { Props } from './types';

const RemoveButton = ({ onRemove }: Props) => {
  const { translate } = useTranslation();

  return (
    <span className="cursor-pointer text-14 font-medium text-primary" onClick={onRemove}>
      {translate('common.remove')}
    </span>
  );
};

export default RemoveButton;
