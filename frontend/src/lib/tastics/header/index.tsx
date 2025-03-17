'use client';
import React, { useMemo } from 'react';
import Header from '@/components/organisms/header';
import AnnouncementBar from '@/components/organisms/announcement-bar';
import { useTranslations } from 'use-intl';
import useMediaQuery from '@/hooks/useMediaQuery';
import { desktop } from '@/constants/screensizes';
import { resolveReference } from '@/utils/lib/resolve-reference';
import { mapProductSuggestion } from '@/utils/mappers/map-product-suggestion';
import { Link } from '@/types/link';
import { NavigationCategory } from '@/components/organisms/header/types';
import useAccountRoles from '@/lib/hooks/useAccountRoles';
import { classnames } from '@/utils/classnames/classnames';
import { TasticProps } from '../types';
import { HeaderTasticProps } from './types';
import useHeaderData from './hooks/useHeaderData';

const HeaderTastic = ({ data }: TasticProps<HeaderTasticProps>) => {
  const translate = useTranslations();
  const [isDesktopSize] = useMediaQuery(desktop);

  const {
    account,
    businessUnits,
    selectedBusinessUnit,
    businessUnitIsLoading,
    stores,
    selectedStore,
    quotes,
    totalCartItems,
    navigationCategories,
    headerSearch,
    headerProducts,
    quickOrderSearch,
    quickOrderProducts,
    csvShowProducts,
    csvShowProductsLoading,
    addToCart,
    onHeaderSearch,
    onQuickOrderSearch,
    onBusinessUnitSelect,
    onStoreSelect,
    onLogoutClick,
    headerSearchAction,
    handleSKUsUpdate,
  } = useHeaderData();

  const { isAdmin } = useAccountRoles(selectedBusinessUnit);

  const { permissions } = useAccountRoles(selectedBusinessUnit);

  const pageLinks: Link[] = data.pageLinks.map((pl) => {
    return { name: pl.name, href: resolveReference(pl.href).href };
  });

  const myAccountMenu: NavigationCategory = {
    categoryId: data.accountLinkId,
    name: data.accountLinkLabel,
    path: resolveReference(data.accountLink).href ?? '/',
    paths: {},
    descendants: data.accountPageLinks.map((link) => {
      return {
        categoryId: link.linkId,
        name: link.name,
        path: resolveReference(link.href).href ?? '/',
        paths: {},
        descendants: [],
      };
    }),
  };

  const accountLinks: NavigationCategory[] = useMemo(() => {
    return isAdmin
      ? myAccountMenu.descendants
      : myAccountMenu.descendants.filter((descendant) => descendant.categoryId != 'company-admin');
  }, [isAdmin, myAccountMenu.descendants]);

  const accountMenuMobile: NavigationCategory = {
    ...myAccountMenu,
    descendants: myAccountMenu.descendants.filter((descendant) => descendant.categoryId != 'company-admin'),
  };

  return (
    <div className={classnames(data.variant === 'navigation' ? 'h-[179px] lg:h-[112px]' : 'h-[72px]')}>
      <div id="header-container" className="fixed top-0 z-50 w-full">
        <div className="relative">
          {data.variant === 'navigation' && (
            <AnnouncementBar
              textBar={data.textBar}
              accountLinks={accountLinks}
              selectedBusinessUnit={selectedBusinessUnit}
              businessUnitIsLoading={businessUnitIsLoading}
              businessUnits={businessUnits}
              stores={stores}
              selectedStore={selectedStore}
              name={account?.firstName ?? ''}
              quotes={quotes?.length ?? 0}
              onLogoutClick={onLogoutClick}
              onBusinessUnitChange={onBusinessUnitSelect}
              onStoreChange={onStoreSelect}
            />
          )}
          <Header
            variant={data.variant ?? 'navigation'}
            isAdmin={isAdmin}
            csvDownloadLink="/template.csv"
            quickOrderProducts={quickOrderProducts.map((product) => mapProductSuggestion(product))}
            addToCartDisabled={!permissions.UpdateMyCarts}
            selectedBusinessUnit={selectedBusinessUnit}
            businessUnits={businessUnits}
            stores={stores}
            selectedStore={selectedStore}
            categoryLinks={navigationCategories}
            myAccountMenu={accountMenuMobile}
            accountLink={resolveReference(data.accountLink)}
            cartItems={totalCartItems}
            cartLink={resolveReference(data.cartLink)}
            pageLinks={pageLinks}
            logo={data.logo}
            logoLink={resolveReference(data.logoLink)}
            searchPlaceholder={
              isDesktopSize ? translate('common.search-placeholder') : translate('common.search-placeholder-mobile')
            }
            searchSuggestions={headerProducts.map((product) => mapProductSuggestion(product))}
            quotes={quotes?.length ?? 0}
            onBusinessUnitChange={onBusinessUnitSelect}
            onStoreChange={onStoreSelect}
            quickOrderSearch={quickOrderSearch}
            onQuickOrderSearch={onQuickOrderSearch}
            headerSearch={headerSearch}
            onHeaderSearch={onHeaderSearch}
            onHeaderSearchAction={headerSearchAction}
            addToCart={addToCart}
            csvShowProducts={csvShowProducts}
            csvShowProductsLoading={csvShowProductsLoading}
            handleSKUsUpdate={handleSKUsUpdate}
          />
        </div>
      </div>
    </div>
  );
};
export default HeaderTastic;
