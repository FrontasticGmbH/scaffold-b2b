import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';

const EntitiesLoading = () => {
  const { translate } = useTranslation();

  return (
    <div className={'border-x border-b border-neutral-400 py-[52px] text-center'}>
      <p className="text-14 text-gray-600">{translate('dashboard.entity.loading')}</p>
    </div>
  );
};

export default EntitiesLoading;
