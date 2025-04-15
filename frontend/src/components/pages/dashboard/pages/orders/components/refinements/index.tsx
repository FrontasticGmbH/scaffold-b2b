import React from 'react';
import { useTranslations } from 'use-intl';
import SearchInput from '@/components/atoms/search-input';
import MultiSelect from '@/components/atoms/multi-select';
import DatePickerInput from '@/components/molecules/date-picker-input';
import { OrdersPageProps } from '../../types';

const Refinements = ({
  filters,
  onSearch,
  statusOptions,
  onStatusRefine,
  onCreationDateRefine,
}: Partial<OrdersPageProps>) => {
  const translate = useTranslations();

  const refinements = [
    {
      title: 'orders.label',
      Component: (
        <SearchInput
          containerClassName="h-[38px] w-[360px]"
          searchValue={filters?.search ?? ''}
          variant="xs"
          placeholder={`${translate('dashboard.search-for-orders')}...`}
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
      title: 'dashboard.creation-date',
      Component: (
        <DatePickerInput
          mode="range"
          selected={{
            from: filters?.createdFrom ? new Date(filters?.createdFrom) : undefined,
            to: filters?.createdTo ? new Date(filters?.createdTo) : undefined,
          }}
          onSelect={(range) => onCreationDateRefine?.({ from: range?.from, to: range?.to })}
        />
      ),
    },
  ];

  return (
    <div className="hidden gap-3 lg:flex">
      {refinements.map(({ title, Component }, index) => (
        <div key={index}>
          <p className="text-14 text-gray-700">
            {
              // eslint-disable-next-line
              // @ts-ignore
              translate(title)
            }
          </p>
          <div className="mt-2">{Component}</div>
        </div>
      ))}
    </div>
  );
};

export default Refinements;
