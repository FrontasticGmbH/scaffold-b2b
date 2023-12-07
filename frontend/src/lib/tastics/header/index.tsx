'use client';
import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/organisms/header';
import AnnouncementBar from '@/components/organisms/announcement-bar';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import useMediaQuery from '@/hooks/useMediaQuery';
import { desktop } from '@/constants/screensizes';
import useAccount from '@/lib/hooks/useAccount';
import useResizeObserver from '@/hooks/useResizeObserver';
import { resolveReference } from '@/utils/lib/resolve-reference';
import { useCategories } from '@/lib/hooks/useCategories';
import { mapCategory } from '@/utils/mappers/map-category';
import useCart from '@/lib/hooks/useCart';
import useBusinessUnits from '@/lib/hooks/useBusinessUnits';
import useStores from '@/lib/hooks/useStores';
import useQuotes from '@/lib/hooks/useQuotes';
import { Option } from '@/components/atoms/select/types';
import useAccountRoles from '@/lib/hooks/useAccountRoles';
import { NavigationCategory } from '@/components/organisms/header/types';
import { Quote } from '@shared/types/quote/Quote';
import { TasticProps } from '../types';
import { myAccountMenu, pageLinks, textBar, suggestions, quickOrderProducts } from './mocks';
import { HeaderTasticProps } from './types';
import useBusinessUnit from '../company-admin/hooks/useBusinessUnit';
import useStore from './hooks/useStore';

const HeaderTastic = ({ data }: TasticProps<HeaderTasticProps>) => {
  const { translate } = useTranslation();
  const [isDesktopSize] = useMediaQuery(desktop);
  const router = useRouter();

  const { defaultBusinessUnit } = useBusinessUnits();

  const { businessUnits, activeBusinessUnit, onBusinessUnitSelected } = useBusinessUnit();

  const { defaultStore } = useStores();

  const { storeOptions, onStoreSelected } = useStore({ activeBusinessUnit });

  const { totalItems } = useCart(defaultBusinessUnit?.key, defaultStore?.key);

  const { categories } = useCategories();
  const navigationCategories = categories.map(mapCategory).filter((category) => !!category.name);

  const { quotes } = useQuotes({});
  const quotesPending = quotes?.items?.filter((quote: Quote) => quote?.quoteState === 'Pending');

  const { account, logout } = useAccount();

  const { isAdmin } = useAccountRoles();

  const { ref } = useResizeObserver(
    (el: HTMLDivElement) => {
      const bodySection = document.querySelector('.body-section') as HTMLDivElement | undefined;
      if (bodySection) bodySection.style.paddingTop = `${el.clientHeight}px`;
    },
    () => {
      const bodySection = document.querySelector('.body-section') as HTMLDivElement | undefined;
      if (bodySection) bodySection.style.paddingTop = '0';
    },
  );

  const onLogoutClick = () => {
    logout().then(() => router.push('login'));
  };

  const mapBusinessUnits: Option[] = businessUnits.map(({ name, key }) => {
    return { name: name ?? key ?? 'Name', value: key ?? 'key' };
  });

  const accountLinks: NavigationCategory[] = useMemo(() => {
    return isAdmin
      ? myAccountMenu.subCategories
      : myAccountMenu.subCategories.filter((subCategory) => subCategory.categoryId != 'company-admin');
  }, [isAdmin]);

  const accountMenuMobile: NavigationCategory = {
    ...myAccountMenu,
    subCategories: myAccountMenu.subCategories.filter((subCategory) => subCategory.categoryId != 'company-admin'),
  };

  return (
    <div id="header-container" className="fixed top-0 z-50 w-full" ref={ref}>
      <div className="relative">
        <AnnouncementBar
          textBar={textBar}
          accountLinks={accountLinks}
          selectedBusinessUnit={activeBusinessUnit?.key ?? 'Select'}
          businessUnits={mapBusinessUnits}
          stores={storeOptions}
          selectedStore={defaultStore?.key ?? 'Select'}
          name={account?.firstName ?? ''}
          quotes={quotesPending?.length ?? 0}
          onLogoutClick={onLogoutClick}
          onBusinessUnitChange={onBusinessUnitSelected}
          onStoreChange={onStoreSelected}
        />
        <Header
          isAdmin={isAdmin}
          csvDownloadLink="/template.csv"
          quickOrderProducts={quickOrderProducts}
          selectedBusinessUnit={activeBusinessUnit?.key ?? ''}
          businessUnits={mapBusinessUnits}
          selectedStore={defaultStore?.key ?? ''}
          stores={storeOptions}
          categoryLinks={navigationCategories}
          myAccountMenu={accountMenuMobile}
          accountLink={resolveReference(data.accountLink)}
          cartItems={totalItems}
          cartLink={resolveReference(data.cartLink)}
          pageLinks={pageLinks}
          logo={data.logo}
          logoLink={resolveReference(data.logoLink)}
          searchPlaceholder={
            isDesktopSize ? translate('common.search.placeholder') : translate('common.search.placeholder.mobile')
          }
          searchSuggestions={suggestions}
          quotes={quotesPending?.length ?? 0}
          onBusinessUnitChange={onBusinessUnitSelected}
          onStoreChange={onStoreSelected}
        />
      </div>
    </div>
  );
};
export default HeaderTastic;
