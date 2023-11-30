import { useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Suggestion } from '../../types';

const useProductSearch = (items?: Suggestion[], searchCallback?: () => void) => {
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce<string>(searchValue, 150);

  const handleOnChange = (value: string) => {
    searchCallback?.();
    setSearchValue(value);
  };

  const [products, setProducts] = useState<Suggestion[]>([]);

  const searchResult = useMemo(() => {
    return items?.filter(
      (item) =>
        item.name.toUpperCase().includes(debouncedValue.toUpperCase() ?? '') ||
        item.name.toLowerCase().includes(debouncedValue.toLowerCase() ?? '') ||
        item.sku.includes(debouncedValue ?? ''),
    );
  }, [items, debouncedValue]);

  const insertProduct = (product: Suggestion) => {
    setProducts((array) => [...array, product]);
  };

  const removeProduct = (product: Suggestion) => {
    setProducts((array) => array.filter((item) => item.sku !== product.sku));
  };

  return {
    searchValue,
    handleOnChange,
    products,
    insertProduct,
    removeProduct,
    searchResult,
  };
};
export default useProductSearch;
