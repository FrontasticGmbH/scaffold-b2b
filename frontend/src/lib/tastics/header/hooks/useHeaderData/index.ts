import { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
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
import { mapCsvProduct } from '@/utils/mappers/map-csv-product';
import useSwrClearCache from '@/hooks/useSwrClearCache';

const useHeaderData = () => {
  const router = useCustomRouter();

  const { locale } = useParams();

  const clearCache = useSwrClearCache();

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query');

  const { defaultBusinessUnit, businessUnits } = useBusinessUnits();

  const { stores } = useStores();

  const mappedStores = (stores ?? []).map((st) => {
    return { name: st.name ?? st.key, value: st.key };
  });

  const {
    selectedBusinessUnit,
    selectedStore,
    setSelectedBusinessUnitKey,
    setSelectedStoreKey,
    clearBusinessUnitAndStoreFromStorage,
    sessionIsUpdating,
  } = useStoreAndBusinessUnits();

  const { totalItems: totalCartItems, addItem } = useCart(selectedBusinessUnit?.key, selectedStore?.key);

  const { categories } = useCategories();

  const navigationCategories = categories
    .map((c) => mapCategory(c, { locale }))
    .filter((category) => !!category.name || !!category.path);

  const { quotes } = useQuotes({ businessUnitKey: selectedBusinessUnit?.key ?? '' });
  const quotesMapped = quotes?.items?.filter((quote: Quote) => quote?.quoteState === 'Pending');

  const { account, logout } = useAccount();

  const onLogoutClick = () => {
    logout().then(() => {
      router.push('/login');
      router.refresh();
      clearCache();
      clearBusinessUnitAndStoreFromStorage();
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

  const headerSearchAction = () => router.push(`/search/?query=${headerSearch}`);

  const [skus, setSKUs] = useState<string[] | undefined>([]);

  const handleSKUsUpdate = (skus: string[]) => setSKUs(skus);

  const { products: csvShowProducts, isLoading: csvShowProductsLoading } = useProductSearch(
    '',
    skus,
    skus?.length ?? 0,
    selectedStore?.key,
  );

  return {
    account,
    navigationCategories,
    defaultBusinessUnit,
    selectedStore: selectedStore?.key,
    stores: mappedStores,
    selectedBusinessUnit: selectedBusinessUnit?.key,
    businessUnitIsLoading: sessionIsUpdating,
    businessUnits: mappedBusinessUnits,
    totalCartItems,
    quotes: quotesMapped,
    headerSearch,
    headerProducts,
    quickOrderSearch,
    quickOrderProducts,
    csvShowProducts: csvShowProducts.map((product) => product.variants.map(mapCsvProduct)).flat(),
    csvShowProductsLoading,
    addToCart: addItem,
    onBusinessUnitSelect: setSelectedBusinessUnitKey,
    onStoreSelect: setSelectedStoreKey,
    onHeaderSearch,
    onQuickOrderSearch,
    onLogoutClick,
    headerSearchAction,
    handleSKUsUpdate,
  };
};
export default useHeaderData;
