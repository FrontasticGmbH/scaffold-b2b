export interface AccordionContextShape {
  isExpanded: boolean;
  isStable: boolean;
  expand: () => void;
  collapse: () => void;
  toggle: () => void;
}

export interface AccordionProviderProps {
  defaultIsExpanded?: boolean;
  isExpanded?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
}
