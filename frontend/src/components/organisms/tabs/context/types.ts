export interface TabsContextShape {
  activeTabIndex: number;
  setActiveTabIndex: (index: number) => void;
  onActiveIndexChange?: (index: number) => void;
}

export interface TabsContextProps {
  defaultActiveIndex?: number;
  onActiveIndexChange?: (index: number) => void;
}
