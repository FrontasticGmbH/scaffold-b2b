import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { mapCsvProduct } from '@/utils/mappers/map-csv-product';

const useHeaderData = () => {
  const router = useRouter();
  const { translate } = useTranslation();

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query');

  const { defaultBusinessUnit, businessUnits } = useBusinessUnits();

  const { defaultStore, stores } = useStores();

  const mappedStores = (stores ?? []).map((st) => {
    return { name: st.name ?? st.key, value: st.key };
  });

  const { selectedBusinessUnit, selectedStore, setSelectedBusinessUnit, setSelectedStore } = useStoreAndBusinessUnits();

  const onBusinessUnitSelect = useCallback(
    (key: string) => {
      const bu = (businessUnits ?? []).find((bu) => bu.key === key);
      if (bu) {
        setSelectedBusinessUnit(mapBusinessUnit(bu));
        localStorage.setItem('business-unit', bu.key ?? '');
      }
    },
    [businessUnits, setSelectedBusinessUnit],
  );

  const onStoreSelect = useCallback(
    (key: string) => {
      const st = (stores ?? []).find((s) => s.key === key);
      if (st) {
        setSelectedStore(mapStore(st));
        localStorage.setItem('store', st.key ?? '');
      }
    },
    [setSelectedStore, stores],
  );

  useEffect(() => {
    onBusinessUnitSelect(localStorage.getItem('business-unit') ?? (defaultBusinessUnit?.key as string));
    onStoreSelect(localStorage.getItem('store') ?? (defaultStore?.key as string));
  }, [onStoreSelect, onBusinessUnitSelect, defaultBusinessUnit?.key, defaultStore?.key]);

  const { totalItems: totalCartItems, addItem } = useCart(selectedBusinessUnit?.key, selectedStore?.key);

  const { categories } = useCategories();
  const navigationCategories = categories.map(mapCategory).filter((category) => !!category.name || !!category.path);

  const { quotes } = useQuotes({});
  const quotesMapped = quotes?.items?.filter((quote: Quote) => quote?.quoteState === 'Pending');

  const { account, logout } = useAccount();

  const onLogoutClick = () => {
    logout().then(() => router.push('login'));
  };

  const mappedBusinessUnits: Option[] = businessUnits?.map(({ name, key }) => {
    return { name: name ?? key ?? 'Name', value: key ?? 'key' };
  });

  const [quickOrderSearch, setQuickOrderSearch] = useState('');

  const debouncedQuickOrderSearch = useDebounce<string>(quickOrderSearch, 150);

  const onQuickOrderSearch = (value: string) => setQuickOrderSearch(value);

  const { products: quickOrderProducts } = useProductSearch(debouncedQuickOrderSearch);

  const [headerSearch, setHeaderSearch] = useState(searchQuery || '');

  const debouncedHeaderSearch = useDebounce<string>(headerSearch, 150);

  const onHeaderSearch = (value: string) => setHeaderSearch(value);

  const { products: headerProducts } = useProductSearch(debouncedHeaderSearch);

  const headerSearchAction = () => router.push(`/search/?query=${debouncedHeaderSearch}`);

  const [skus, setSKUs] = useState<string[] | undefined>([]);

  const handleSKUsUpdate = (skus: string[]) => setSKUs(skus);

  const { products: csvShowProducts } = useProductSearch('', skus, skus?.length ?? 0);

  return {
    account,
    navigationCategories,
    defaultBusinessUnit,
    selectedStore: selectedStore?.key ?? translate('select'),
    stores: mappedStores,
    selectedBusinessUnit: selectedBusinessUnit?.key ?? translate('select'),
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
