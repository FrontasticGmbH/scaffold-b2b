import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { MagnifyingGlassIcon as SearchIcon } from '@heroicons/react/24/outline';
import { classnames } from '@/utils/classnames/classnames';
import { Props } from './types';

const EntitiesNotFound = ({ search, entity }: Props) => {
  const { translate } = useTranslation();

  return (
    <div className={classnames('border-x border-b border-neutral-400 text-center', search ? 'py-8' : 'py-[52px]')}>
      {search ? (
        <div className="flex flex-col items-center">
          <span className="block rounded-lg bg-[#ECF0FB] p-3">
            <SearchIcon className="text-primary" width={24} height={24} />
          </span>
          <span className="mt-4 font-semibold text-gray-700">{translate('dashboard.no.search.results')}</span>
          <span className="mt-1 text-14 text-gray-600">{translate('dashboard.try.different.search.term')}</span>
        </div>
      ) : (
        <p className="text-14 text-gray-600">{translate('dashboard.no.entity.added', { values: { entity } })}</p>
      )}
    </div>
  );
};

export default EntitiesNotFound;
