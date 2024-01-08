import React from 'react';
import NavigationDrawer from './navigation-drawer';
import Logo from './logo';
import Search from '../search';
import { HeaderProvider } from './context';
import QuickOrderDesktop from '../quick-order/quick-order-desktop';
import CartLink from './cart-link';
import { HeaderProps } from './types';
import AccountLink from './account-link';

const Header = ({
  variant,
  searchPlaceholder,
  searchSuggestions,
  headerSearch,
  onHeaderSearch,
  onHeaderSearchAction,
  ...props
}: HeaderProps) => {
  return (
    <HeaderProvider {...props}>
      <header>
        <div className="flex h-[72px] items-center justify-between border-b border-neutral-400 bg-white p-4 md:px-5 lg:px-12 lg:py-1">
          <div className="flex items-center gap-x-1 md:gap-x-2 lg:gap-x-4">
            {variant === 'navigation' && <NavigationDrawer />}
            <div className="w-[180px] lg:w-[205px]">
              <Logo {...props} />
            </div>
          </div>
          {variant === 'navigation' && (
            <div className="hidden w-[500px] lg:block xl:w-[600px]">
              <Search
                variant="lg"
                scrollControl
                searchValue={headerSearch}
                placeholder={searchPlaceholder}
                suggestions={searchSuggestions}
                filterSearch={false}
                handleOnChange={onHeaderSearch}
                handleSearchAction={onHeaderSearchAction}
              />
            </div>
          )}
          <div className="flex items-center gap-5 lg:gap-10">
            {variant === 'navigation' && (
              <div className="hidden lg:block">
                <QuickOrderDesktop
                  downloadLink={props.csvDownloadLink}
                  searchText={props.quickOrderSearch}
                  onSearch={props.onQuickOrderSearch}
                  items={props.quickOrderProducts}
                  addItem={props.addToCart}
                  csvProducts={props.csvShowProducts}
                  handleSKUsUpdate={props.handleSKUsUpdate}
                />
              </div>
            )}
            <div className="block lg:hidden">
              <AccountLink />
            </div>

            {variant != 'account' && <CartLink />}
          </div>
        </div>
        {variant === 'navigation' && (
          <div className="block w-full border-b bg-white md:px-3 lg:hidden">
            <Search
              variant="lg"
              scrollControl
              placeholder={searchPlaceholder}
              searchValue={headerSearch}
              suggestions={searchSuggestions}
              filterSearch={false}
              handleOnChange={onHeaderSearch}
              handleSearchAction={onHeaderSearchAction}
            />
          </div>
        )}
      </header>
    </HeaderProvider>
  );
};
export default Header;
