import React, { createContext, useState } from 'react';
import { NavigationCategory, ContextShape, ContextProps } from '../types';

const HeaderContext = createContext({} as ContextShape);

const HeaderProvider = ({
  isAdmin,
  myAccountMenu,
  pageLinks,
  categoryLinks,
  accountLink,
  cartItems,
  cartLink,
  logo,
  logoLink,
  children,
  businessUnits,
  selectedBusinessUnit,
  selectedStore,
  stores,
  quotes,
  quickOrderProducts,
  quickOrderSearch,
  onQuickOrderSearch,
  onBusinessUnitChange,
  onStoreChange,
  addToCart,
}: React.PropsWithChildren<ContextProps>) => {
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
        isAdmin,
        myAccountMenu,
        pageLinks,
        categoryLinks,
        logo,
        logoLink,
        cartItems,
        cartLink,
        accountLink,
        showQuickOrder,
        showMenu,
        navigationLevel,
        selectedBusinessUnit,
        businessUnits,
        selectedStore,
        stores,
        quotes,
        quickOrderProducts,
        quickOrderSearch,
        onQuickOrderSearch,
        onStoreChange,
        onBusinessUnitChange,
        insertCategory,
        removeCategory,
        showQuickOrderMenu,
        hideQuickOrderMenu,
        showHeaderMenu,
        hideHeaderMenu,
        addToCart,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};
export { HeaderContext, HeaderProvider };
