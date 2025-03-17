import React from 'react';
import SearchInput from '@/components/atoms/search-input';
import { useTranslations } from 'use-intl';
import { QuestionMarkCircleIcon as InfoIcon } from '@heroicons/react/24/outline';
import { Props } from './types';

const Refinements = ({ onSearch, searchValue, onInfoClick }: Props) => {
  const translate = useTranslations();

  return (
    <div className="hidden items-center justify-between lg:flex">
      <div className="flex gap-3">
        <SearchInput
          containerClassName="h-[38px] w-[360px]"
          searchValue={searchValue}
          variant="xs"
          placeholder={`${translate('dashboard.search-by-id-sku')}...`}
          handleOnChange={(val) => onSearch(val)}
        />
      </div>
      <div className="hidden items-center gap-1 text-gray-600 md:flex">
        <span className="text-14">{translate('common.status')}</span>
        <InfoIcon className="size-[24px] cursor-pointer" onClick={onInfoClick} />
      </div>
    </div>
  );
};

export default Refinements;
