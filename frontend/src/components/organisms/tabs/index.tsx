'use client';

import React from 'react';
import TabsProvider from './context';
import TabList from './components/tab-list';
import Tab from './components/tab';
import Panels from './components/panels';
import Panel from './components/panel';
import { TabsContextProps } from './context/types';

const Tabs: React.FC<React.PropsWithChildren<TabsContextProps>> & {
  TabList: typeof TabList;
  Tab: typeof Tab;
  Panels: typeof Panels;
  Panel: typeof Panel;
} = ({ children, ...props }) => {
  return <TabsProvider {...props}>{children}</TabsProvider>;
};

Tabs.TabList = TabList;
Tabs.Tab = Tab;
Tabs.Panels = Panels;
Tabs.Panel = Panel;

export default Tabs;
