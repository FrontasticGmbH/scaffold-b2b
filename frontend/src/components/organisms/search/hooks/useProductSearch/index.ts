import { useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { ProductSuggestion } from '../../types';

const useQuickProductSearch = (items?: ProductSuggestion[], searchCallback?: () => void) => {
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce<string>(searchValue, 150);

  const handleOnChange = (value: string) => {
    searchCallback?.();
    setSearchValue(value);
  };

  const [products, setProducts] = useState<ProductSuggestion[]>([]);

  const searchResult = useMemo(() => {
    return items?.filter(
      (item) =>
        item.name.toUpperCase().includes(debouncedValue.toUpperCase() ?? '') ||
        item.name.toLowerCase().includes(debouncedValue.toLowerCase() ?? '') ||
        item.sku.includes(debouncedValue ?? ''),
    );
  }, [items, debouncedValue]);

  const insertProduct = (product: ProductSuggestion) => {
    setProducts((array) => [...array, product]);
  };

  const removeProduct = (product: ProductSuggestion) => {
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
export default useQuickProductSearch;
