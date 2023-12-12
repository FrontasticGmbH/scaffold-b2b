import React, { createContext, useState } from 'react';
import { Link } from '@/types/link';
import { Image as LogoImage } from '@/types/image';
import { Option } from '@/components/atoms/select/types';
import { NavigationCategory, ContextShape } from '../types';
import { Suggestion } from '../../search/types';

const initialMarketState = {
  myAccount: {} as NavigationCategory,
  pageLinks: [] as Link[],
  categoryLinks: [] as NavigationCategory[],
  logo: {} as LogoImage,
  logoLink: {} as Link,
  cartItems: 0 as number,
  cartLink: {} as Link,
  accountLink: {} as Link,
  showQuickOrder: false as boolean,
  showQuickOrderMenu: {} as () => void,
  hideQuickOrderMenu: {} as () => void,
  showMenu: false as boolean,
  showHeaderMenu: {} as () => void,
  hideHeaderMenu: {} as () => void,
  navigationLevel: [] as NavigationCategory[],
  insertCategory: {} as (category: NavigationCategory) => void,
  removeCategory: {} as () => void,
  businessUnits: [] as Option[],
  stores: [] as Option[],
  quotas: 0 as number,
  quickOrderProducts: [] as Suggestion[],
};

const HeaderContext = createContext(initialMarketState);

const HeaderProvider = ({
  myAccount,
  pageLinks,
  categoryLinks,
  accountLink,
  cartItems,
  cartLink,
  logo,
  logoLink,
  children,
  businessUnits,
  stores,
  quotas,
  quickOrderProducts,
}: React.PropsWithChildren<ContextShape>) => {
  const [navigationLevel, setNavigationLevel] = useState<NavigationCategory[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showQuickOrder, setShowQuickOrder] = useState(false);

  const showHeaderMenu = () => {
    setShowMenu(true);
  };

  const hideHeaderMenu = () => {
    setShowMenu(false);
    setNavigationLevel([]);
  };

  const showQuickOrderMenu = () => {
    setShowQuickOrder(true);
  };

  const hideQuickOrderMenu = () => {
    setShowQuickOrder(false);
  };

  const removeCategory = () => {
    setNavigationLevel((array) => array.slice(0, -1));
  };

  const insertCategory = (category: NavigationCategory) => {
    setNavigationLevel((array) => [...array, category]);
  };

  return (
    <HeaderContext.Provider
      value={{
        myAccount: myAccount,
        pageLinks: pageLinks,
        categoryLinks: categoryLinks,
        logo: logo,
        logoLink: logoLink,
        cartItems: cartItems,
        cartLink: cartLink,
        accountLink: accountLink,
        showQuickOrder: showQuickOrder,
        showQuickOrderMenu: showQuickOrderMenu,
        hideQuickOrderMenu: hideQuickOrderMenu,
        showMenu: showMenu,
        showHeaderMenu: showHeaderMenu,
        hideHeaderMenu: hideHeaderMenu,
        navigationLevel: navigationLevel,
        insertCategory: insertCategory,
        removeCategory: removeCategory,
        businessUnits: businessUnits,
        stores: stores,
        quotas: quotas,
        quickOrderProducts,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};
export { HeaderContext, HeaderProvider };
