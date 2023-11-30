'use client';
import React from 'react';
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
import { TasticProps } from '../types';
import { businessUnits, myAccount, pageLinks, quotas, stores, textBar, suggestions, quickOrderProducts } from './mocks';
import { HeaderTasticProps } from './types';

const HeaderTastic = ({ data }: TasticProps<HeaderTasticProps>) => {
  const { translate } = useTranslation();
  const [isDesktopSize] = useMediaQuery(desktop);
  const router = useRouter();

  const { defaultBusinessUnit } = useBusinessUnits();
  const { defaultStore } = useStores();

  const { totalItems } = useCart(defaultBusinessUnit?.key, defaultStore?.key);

  const { categories } = useCategories();

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

  const { account, logout } = useAccount();

  const onLogoutClick = () => {
    logout().then(() => router.push('login'));
  };

  return (
    <div id="header-container" className="fixed top-0 z-50 w-full" ref={ref}>
      <div className="relative">
        <AnnouncementBar
          textBar={textBar}
          myAccount={myAccount}
          businessUnits={businessUnits}
          stores={stores}
          onLogoutClick={onLogoutClick}
          name={account?.firstName ?? ''}
          quotas={quotas}
        />
        <Header
          csvDownloadLink="/template.csv"
          quickOrderProducts={quickOrderProducts}
          businessUnits={businessUnits}
          stores={stores}
          categoryLinks={categories.map(mapCategory)}
          myAccount={myAccount}
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
          quotas={22}
        />
      </div>
    </div>
  );
};
export default HeaderTastic;
