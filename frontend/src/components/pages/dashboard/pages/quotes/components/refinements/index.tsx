import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import SearchInput from '@/components/atoms/search-input';
import Dropdown from '@/components/atoms/dropdown';
import Checkbox from '@/components/atoms/checkbox';
import DatePicker from '@/components/molecules/date-picker';
import { QuestionMarkCircleIcon as InfoIcon } from '@heroicons/react/24/outline';
import { QuotesPageProps } from '../../types';

const Refinements = ({
  filters,
  onSearch,
  statusOptions,
  onStatusRefine,
  onCreationDateRefine,
  onInfoClick,
}: Partial<QuotesPageProps & { onInfoClick: () => void }>) => {
  const { translate } = useTranslation();

  const refinements = [
    {
      title: 'dashboard.quote.search',
      Component: (
        <SearchInput
          className="w-[360px]"
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
        <Dropdown size="sm" className="w-[200px]">
          <Dropdown.Button>{translate('common.select')}</Dropdown.Button>
          <Dropdown.Options className="min-w-fit">
            {(statusOptions ?? []).map(({ name, value, count }) => (
              <div key={value} className="flex items-center justify-between gap-8 p-2">
                <span className="text-14 text-gray-700">{name}</span>
                <div className="flex items-center gap-2">
                  {/* <span className="text-12 text-gray-600">{count}</span> */}
                  <Checkbox checked={!!filters?.status?.includes(value)} onChecked={() => onStatusRefine?.(value)} />
                </div>
              </div>
            ))}
          </Dropdown.Options>
        </Dropdown>
      ),
    },
    // {
    //   title: 'dashboard.creation.date',
    //   Component: (
    //     <Dropdown size="sm" className="w-[200px]">
    //       <Dropdown.Button>{filters?.creationDate ?? translate('common.select')}</Dropdown.Button>
    //       <Dropdown.Options className="max-h-[unset] w-max">
    //         <DatePicker
    //           mode="single"
    //           selected={filters?.creationDate ? new Date(filters.creationDate) : undefined}
    //           onSelect={(date) => onCreationDateRefine?.(date ? new Date(date).toLocaleDateString() : '')}
    //         />
    //       </Dropdown.Options>
    //     </Dropdown>
    //   ),
    // },
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
