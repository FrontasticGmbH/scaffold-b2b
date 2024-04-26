import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Select from '@/components/atoms/select';
import { useProductList } from '../../context';

const SortDropdown = () => {
  const { translate } = useTranslation();

  const { sortValues, currentSortValue, currentSortVector, onSortValueChange } = useProductList();

  return (
    <div className="flex items-center gap-2">
      <span className="text-14 text-gray-700">{translate('product.sortBy')}:</span>
      <Select
        value={`${currentSortValue}_${currentSortVector}`}
        options={sortValues.map(({ name, value, vector }) => ({ name, value: `${value}_${vector}` }))}
        onChange={(val) => {
          const [value, vector] = val.split('_') as [string, 'asc' | 'desc'];

          onSortValueChange(value, vector);
        }}
        size="sm"
        className="min-w-[130px] leading-[14px]"
      />
    </div>
  );
};

export default SortDropdown;
