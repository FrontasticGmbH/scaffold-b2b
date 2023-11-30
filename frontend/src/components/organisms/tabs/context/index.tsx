import React, { useContext, useState } from 'react';
import { TabsContextProps, TabsContextShape } from './types';

const TabsContext = React.createContext({ activeTabIndex: 0 } as TabsContextShape);

const TabsProvider = ({
  children,
  defaultActiveIndex,
  onActiveIndexChange,
}: React.PropsWithChildren<TabsContextProps>) => {
  const [activeTabIndex, setActiveTabIndex] = useState(defaultActiveIndex ?? 0);

  return (
    <TabsContext.Provider value={{ activeTabIndex, setActiveTabIndex, onActiveIndexChange }}>
      {children}
    </TabsContext.Provider>
  );
};

export default TabsProvider;

export const useTabs = () => useContext(TabsContext);
