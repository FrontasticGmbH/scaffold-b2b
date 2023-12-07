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

const Header = ({ searchPlaceholder, searchSuggestions, csvDownloadLink, ...props }: HeaderProps) => {
  const { searchValue, handleOnChange, searchResult } = useProductSearch(searchSuggestions);
  return (
    <HeaderProvider {...props}>
      <header>
        <div className="flex items-center justify-between border-b border-neutral-400 bg-white p-4 md:px-5 lg:px-12 lg:py-1">
          <div className="flex items-center gap-x-1 md:gap-x-2 lg:gap-x-4">
            <NavigationDrawer />
            <div className="w-[180px] lg:w-[205px]">
              <Logo {...props} />
            </div>
          </div>
          <div className="hidden w-[500px] lg:block xl:w-[600px]">
            <Search
              variant="lg"
              scrollControl
              searchValue={searchValue}
              placeholder={searchPlaceholder}
              suggestions={searchSuggestions}
              searchResult={searchResult}
              filterSearch={false}
              handleOnChange={handleOnChange}
            />
          </div>
          <div className="flex items-center gap-5 lg:gap-10">
            <div className="hidden lg:block">
              <QuickOrderDesktop downloadLink={csvDownloadLink} items={props.quickOrderProducts} />
            </div>
            <div className="block lg:hidden">
              <AccountLink />
            </div>

            <CartLink />
          </div>
        </div>
        <div className="block w-full border-b bg-white md:px-3 lg:hidden">
          <Search
            variant="lg"
            scrollControl
            placeholder={searchPlaceholder}
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
