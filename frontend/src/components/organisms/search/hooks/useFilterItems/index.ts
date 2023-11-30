import { useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Suggestion } from '../../types';

const useFilterItems = (items?: Suggestion[], searchCallback?: () => void) => {
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce<string>(searchValue, 150);

  const handleOnChange = (value: string) => {
    searchCallback?.();
    setSearchValue(value);
  };

  const filterBySearchResult = useMemo(() => {
    return items?.filter(
      (item) =>
        item.name.toUpperCase().includes(debouncedValue.toUpperCase() ?? '') ||
        item.name.toLowerCase().includes(debouncedValue.toLowerCase() ?? '') ||
        item.sku.toLowerCase().includes(debouncedValue.toLowerCase() ?? '') ||
        item.sku.toUpperCase().includes(debouncedValue.toUpperCase() ?? '') ||
        item.id.includes(debouncedValue ?? ''),
    );
  }, [items, debouncedValue]);

  return {
    searchValue,
    handleOnChange,
    filterBySearchResult,
  };
};

export default useFilterItems;
