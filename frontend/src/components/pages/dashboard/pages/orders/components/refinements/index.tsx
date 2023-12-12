import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import SearchInput from '@/components/atoms/search-input';
import Dropdown from '@/components/atoms/dropdown';
import Checkbox from '@/components/atoms/checkbox';
import DatePicker from '@/components/molecules/date-picker';
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
        <Dropdown size="sm" className="w-[200px]">
          <Dropdown.Button>{translate('common.select')}</Dropdown.Button>
          <Dropdown.Options>
            {(statusOptions ?? []).map(({ name, value, count }) => (
              <div key={value} className="flex items-center justify-between p-2">
                <span className="text-14 text-gray-700">{name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-12 text-gray-600">{count}</span>
                  <Checkbox
                    checked={!!filters?.status?.includes(value)}
                    onChecked={(checked) => onStatusRefine?.(checked ? value : '')}
                  />
                </div>
              </div>
            ))}
          </Dropdown.Options>
        </Dropdown>
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
