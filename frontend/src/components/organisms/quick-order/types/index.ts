import { Suggestion } from '../../search/types';

export interface QuickOrderAccordionProps {
  items: Suggestion[];
}
export interface QuickOrderDesktopProps {
  downloadLink: string;
  items: Suggestion[];
}
export interface QuickOrderContentProps {
  items: Suggestion[];
}
export interface QuickOrderMobileProps {
  showQuickOrderMenu: () => void;
}
export interface ProductItemProps {
  product: Suggestion;
  handleQuantityChange: (product: Suggestion, value: number) => void;
  quantity: number;
}

export interface QuickOrderCSVUploadProps {
  downloadLink: string;
}

export interface Product {
  sku: string;
  quantity: number;
  inStock: boolean;
}
