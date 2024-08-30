import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import SearchInput from '@/components/atoms/search-input';
import Dropdown from '@/components/atoms/dropdown';
import DatePicker from '@/components/molecules/date-picker';
import MultiSelect from '@/components/atoms/multi-select';
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
          containerClassName="h-[38px] w-[360px]"
          searchValue={filters?.search ?? ''}
          variant="xs"
          placeholder={`${translate('dashboard.search.for.orders')}...`}
          handleOnChange={(val) => onSearch?.(val)}
        />
      ),
    },
    {
      title: 'common.status',
      Component: (
        <MultiSelect
          className="min-w-[200px]"
          value={filters?.status}
          options={(statusOptions ?? []).map(({ name, value }) => ({
            name,
            value,
          }))}
          onChange={onStatusRefine}
        />
      ),
    },
    {
      title: 'dashboard.creation.date',
      Component: (
        <Dropdown size="lg" className="w-[200px]">
          <Dropdown.Button>{translate('common.select')}</Dropdown.Button>
          <Dropdown.Options className="max-h-[unset] w-max">
            <DatePicker
              mode="range"
              selected={{
                from: filters?.createdFrom ? new Date(filters?.createdFrom) : undefined,
                to: filters?.createdTo ? new Date(filters?.createdTo) : undefined,
              }}
              onSelect={(range) => onCreationDateRefine?.({ from: range?.from, to: range?.to })}
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
