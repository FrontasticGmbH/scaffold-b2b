import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import SearchInput from '@/components/atoms/search-input';
import { QuestionMarkCircleIcon as InfoIcon } from '@heroicons/react/24/outline';
import RefinementDropdown from '@/components/atoms/refinement-dropdown';
import { QuotesPageProps } from '../../types';

const Refinements = ({
  filters,
  onSearch,
  statusOptions,
  onStatusRefine,
  onInfoClick,
}: Partial<QuotesPageProps & { onInfoClick: () => void }>) => {
  const { translate } = useTranslation();

  const refinements = [
    {
      title: 'dashboard.quote.search',
      Component: (
        <SearchInput
          className="h-[38px] w-[360px]"
          searchValue={filters?.search ?? ''}
          variant="xs"
          placeholder={`${translate('dashboard.search.by.id.sku')}...`}
          handleOnChange={(val) => onSearch?.(val)}
        />
      ),
    },
    {
      title: 'common.status',
      Component: (
        <RefinementDropdown
          size="lg"
          className="w-[200px]"
          options={(statusOptions ?? []).map(({ name, value, count }) => ({
            name,
            value,
            count,
            selected: !!filters?.status?.includes(value),
            onSelected: () => onStatusRefine?.(value),
          }))}
        >
          {translate('common.select')}
        </RefinementDropdown>
      ),
    },
  ];

  return (
    <div className="hidden items-center justify-between lg:flex">
      <div className="flex gap-3">
        {refinements.map(({ title, Component }, index) => (
          <div key={index}>
            <h5 className="text-14 text-gray-700">{translate(title)}</h5>
            <div className="mt-2">{Component}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 hidden items-center gap-1 text-gray-600 md:flex">
        <span className="text-14">{translate('common.status')}</span>
        <InfoIcon className="h-[24px] w-[24px] cursor-pointer" onClick={onInfoClick} />
      </div>
    </div>
  );
};

export default Refinements;
