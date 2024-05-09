import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import useAccount from '@/lib/hooks/useAccount';
import useBusinessUnits from '@/lib/hooks/useBusinessUnits';
import useCart from '@/lib/hooks/useCart';
import { useCategories } from '@/lib/hooks/useCategories';
import useQuotes from '@/lib/hooks/useQuotes';
import useStores from '@/lib/hooks/useStores';
import { mapCategory } from '@/utils/mappers/map-category';
import { Quote } from '@shared/types/quote/Quote';
import { Option } from '@/components/atoms/select/types';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import { useDebounce } from '@/hooks/useDebounce';
import useProductSearch from '@/lib/hooks/useProductSearch';
import { mapBusinessUnit } from '@/utils/mappers/map-business-unit';
import { mapStore } from '@/utils/mappers/map-store';
import { mapCsvProduct } from '@/utils/mappers/map-csv-product';
import { BusinessUnit } from '@shared/types/business-unit';
import { Store } from '@shared/types/store';
import useSwrClearCache from '@/hooks/useSwrClearCache';

const useHeaderData = () => {
  const router = useCustomRouter();

  const clearCache = useSwrClearCache();

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query');

  const { defaultBusinessUnit, businessUnits } = useBusinessUnits();

  const { defaultStore, stores } = useStores();

  const mappedStores = (stores ?? []).map((st) => {
    return { name: st.name ?? st.key, value: st.key };
  });

  const { selectedBusinessUnit, selectedStore, setSelectedBusinessUnit, setSelectedStore } = useStoreAndBusinessUnits();

  const onBusinessUnitSelect = useCallback(
    (businessUnitKey: string) => {
      const bu = businessUnits.find((bu) => bu.key === businessUnitKey) as BusinessUnit;

      setSelectedBusinessUnit(mapBusinessUnit(bu));
      localStorage.setItem('business-unit', bu.key as string);
    },
    [setSelectedBusinessUnit, businessUnits],
  );

  const onStoreSelect = useCallback(
    (storeKey: string) => {
      const st = stores.find((st) => st.key === storeKey) as Store;

      setSelectedStore(mapStore(st));
      localStorage.setItem('store', st.key ?? '');
    },
    [setSelectedStore, stores],
  );

  useEffect(() => {
    const bu = businessUnits.find((bu) => bu.key === localStorage.getItem('business-unit')) ?? defaultBusinessUnit;
    const st = stores.find((st) => st.key === localStorage.getItem('store')) ?? defaultStore;

    if (!selectedBusinessUnit && bu) onBusinessUnitSelect(bu.key as string);
    if (!selectedStore && st) onStoreSelect(st.key as string);
  }, [
    onStoreSelect,
    onBusinessUnitSelect,
    defaultBusinessUnit,
    defaultStore,
    businessUnits,
    stores,
    selectedBusinessUnit,
    selectedStore,
  ]);

  const { totalItems: totalCartItems, addItem } = useCart(selectedBusinessUnit?.key, selectedStore?.key);

  const { categories } = useCategories();
  const navigationCategories = categories.map(mapCategory).filter((category) => !!category.name || !!category.path);

  const { quotes } = useQuotes({ businessUnitKey: selectedBusinessUnit?.key ?? '' });
  const quotesMapped = quotes?.items?.filter((quote: Quote) => quote?.quoteState === 'Pending');

  const { account, logout } = useAccount();

  const onLogoutClick = () => {
    logout().then(() => {
      clearCache();
      router.refresh();
      router.push('/login');
    });
  };

  const mappedBusinessUnits: Option[] = businessUnits?.map(({ name, key }) => {
    return { name: name ?? key ?? 'Name', value: key ?? 'key' };
  });

  const [quickOrderSearch, setQuickOrderSearch] = useState('');

  const debouncedQuickOrderSearch = useDebounce<string>(quickOrderSearch, 150);

  const onQuickOrderSearch = (value: string) => setQuickOrderSearch(value);

  const { products: quickOrderProducts } = useProductSearch(
    debouncedQuickOrderSearch,
    undefined,
    undefined,
    selectedStore?.key,
  );

  const [headerSearch, setHeaderSearch] = useState(searchQuery || '');

  const debouncedHeaderSearch = useDebounce<string>(headerSearch, 150);

  const onHeaderSearch = (value: string) => setHeaderSearch(value);

  const { products: headerProducts } = useProductSearch(
    debouncedHeaderSearch,
    undefined,
    undefined,
    selectedStore?.key,
  );

  const headerSearchAction = () => router.push(`/search/?query=${debouncedHeaderSearch}`);

  const [skus, setSKUs] = useState<string[] | undefined>([]);

  const handleSKUsUpdate = (skus: string[]) => setSKUs(skus);

  const { products: csvShowProducts } = useProductSearch('', skus, skus?.length ?? 0, selectedStore?.key);

  return {
    account,
    navigationCategories,
    defaultBusinessUnit,
    selectedStore: selectedStore?.key,
    stores: mappedStores,
    selectedBusinessUnit: selectedBusinessUnit?.key,
    businessUnits: mappedBusinessUnits,
    totalCartItems,
    quotes: quotesMapped,
    headerSearch,
    headerProducts,
    quickOrderSearch,
    quickOrderProducts,
    csvShowProducts: csvShowProducts.map((product) => mapCsvProduct(product)),
    addToCart: addItem,
    onBusinessUnitSelect,
    onStoreSelect,
    setSelectedStore,
    onHeaderSearch,
    onQuickOrderSearch,
    onLogoutClick,
    headerSearchAction,
    handleSKUsUpdate,
  };
};
export default useHeaderData;
