import React from 'react';
import NavigationDrawer from './navigation-drawer';
import Logo from './logo';
import Search from '../search';
import { HeaderProvider } from './context';
import QuickOrderDesktop from '../quick-order/quick-order-desktop';
import CartLink from './cart-link';
import { HeaderProps } from './types';
import AccountLink from './account-link';
import useProductSearch from '../search/hooks/useProductSearch';

const Header = ({
  myAccount,
  pageLinks,
  categoryLinks,
  logo,
  logoLink,
  accountLink,
  cartItems,
  cartLink,
  businessUnits,
  stores,
  searchSuggestions,
  quickOrderProducts,
  searchPlaceholder,
  quotas,
  csvDownloadLink,
}: HeaderProps) => {
  const { searchValue, handleOnChange, searchResult } = useProductSearch(searchSuggestions);
  return (
    <HeaderProvider
      businessUnits={businessUnits}
      stores={stores}
      categoryLinks={categoryLinks}
      myAccount={myAccount}
      accountLink={accountLink}
      cartItems={cartItems}
      cartLink={cartLink}
      pageLinks={pageLinks}
      logo={logo}
      logoLink={logoLink}
      quotas={quotas}
      quickOrderProducts={quickOrderProducts}
    >
      <header>
        <div className="flex items-center justify-between border-b border-neutral-400 bg-white p-4 md:px-5 lg:px-12 lg:py-1">
          <div className="flex items-center gap-x-1 md:gap-x-2 lg:gap-x-4">
            <NavigationDrawer />
            <div className="w-[180px] lg:w-[205px]">
              <Logo logo={logo} logoLink={logoLink} />
            </div>
          </div>
          <div className="hidden w-[500px] lg:block xl:w-[600px]">
            <Search
              scrollControl
              searchValue={searchValue}
              placeholder={searchPlaceholder}
              variant="lg"
              suggestions={searchSuggestions}
              searchResult={searchResult}
              filterSearch={false}
              handleOnChange={handleOnChange}
            />
          </div>
          <div className="flex items-center gap-5 lg:gap-10">
            <div className="hidden lg:block">
              <QuickOrderDesktop downloadLink={csvDownloadLink} items={quickOrderProducts} />
            </div>
            <div className="block lg:hidden">
              <AccountLink />
            </div>

            <CartLink />
          </div>
        </div>
        <div className="block w-full border-b bg-white md:px-3 lg:hidden">
          <Search
            scrollControl
            placeholder={searchPlaceholder}
            variant="lg"
            suggestions={searchSuggestions}
            searchValue={searchValue}
            searchResult={searchResult}
            filterSearch={false}
            handleOnChange={handleOnChange}
          />
        </div>
      </header>
    </HeaderProvider>
  );
};
export default Header;
