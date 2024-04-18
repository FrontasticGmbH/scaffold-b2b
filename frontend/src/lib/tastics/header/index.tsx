'use client';
import React, { useMemo } from 'react';
import Header from '@/components/organisms/header';
import AnnouncementBar from '@/components/organisms/announcement-bar';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
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
  const { translate } = useTranslation();
  const [isDesktopSize] = useMediaQuery(desktop);

  const {
    account,
    businessUnits,
    selectedBusinessUnit,
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
    subCategories: data.accountPageLinks.map((link) => {
      return {
        categoryId: link.linkId,
        name: link.name,
        path: resolveReference(link.href).href ?? '/',
        subCategories: [],
      };
    }),
  };

  const accountLinks: NavigationCategory[] = useMemo(() => {
    return isAdmin
      ? myAccountMenu.subCategories
      : myAccountMenu.subCategories.filter((subCategory) => subCategory.categoryId != 'company-admin');
  }, [isAdmin, myAccountMenu.subCategories]);

  const accountMenuMobile: NavigationCategory = {
    ...myAccountMenu,
    subCategories: myAccountMenu.subCategories.filter((subCategory) => subCategory.categoryId != 'company-admin'),
  };

  return (
    <div className={classnames(data.variant === 'navigation' ? 'h-[179px] lg:h-[112px]' : 'h-[72px]')}>
      <div id="header-container" className=" fixed top-0 z-50  w-full">
        <div className="relative">
          {data.variant === 'navigation' && (
            <AnnouncementBar
              textBar={data.textBar}
              accountLinks={accountLinks}
              selectedBusinessUnit={selectedBusinessUnit}
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
              isDesktopSize ? translate('common.search.placeholder') : translate('common.search.placeholder.mobile')
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
            handleSKUsUpdate={handleSKUsUpdate}
          />
        </div>
      </div>
    </div>
  );
};
export default HeaderTastic;
