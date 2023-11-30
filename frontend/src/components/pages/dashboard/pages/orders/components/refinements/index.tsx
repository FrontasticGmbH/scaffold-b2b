import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import SearchInput from '@/components/atoms/search-input';
import Dropdown from '@/components/atoms/dropdown';
import DatePicker from '@/components/molecules/date-picker';
import RefinementDropdown from '@/components/atoms/refinement-dropdown';
import { OrdersPageProps } from '../../types';

const Refinements = ({
  filters,
  onSearch,
  statusOptions,
  onStatusRefine,
  onCreationDateRefine,
}: Partial<OrdersPageProps>) => {
  const { translate } = useTranslation();

  const refinements = [
    {
      title: 'orders.label',
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
        <RefinementDropdown
          size="sm"
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
    {
      title: 'dashboard.creation.date',
      Component: (
        <Dropdown size="sm" className="w-[200px]">
          <Dropdown.Button>{filters?.creationDate ?? translate('common.select')}</Dropdown.Button>
          <Dropdown.Options className="max-h-[unset] w-max">
            <DatePicker
              mode="single"
              selected={filters?.creationDate ? new Date(filters.creationDate) : undefined}
              onSelect={(date) => onCreationDateRefine?.(date ? new Date(date).toLocaleDateString() : '')}
            />
          </Dropdown.Options>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="hidden gap-3 lg:flex">
      {refinements.map(({ title, Component }, index) => (
        <div key={index}>
          <h5 className="text-14 text-gray-700">{translate(title)}</h5>
          <div className="mt-2">{Component}</div>
        </div>
      ))}
    </div>
  );
};

export default Refinements;
