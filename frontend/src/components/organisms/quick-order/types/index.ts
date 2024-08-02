import { ProductSuggestion } from '../../search/types';

export interface Product {
  sku: string;
  quantity: number;
  inStock: boolean;
  exists: boolean;
}
export interface QuickOrderProps {
  downloadLink: string;
  items: ProductSuggestion[];
  searchText?: string;
  csvProducts: Product[];
  csvProductsLoading: boolean;
  addItemDisabled?: boolean;
  addItem?: (
    lineItems: Array<{
      sku: string;
      count: number;
    }>,
  ) => Promise<object>;
  closeMenu?: () => void;
  onSearch?: (value: string) => void;
  handleSKUsUpdate?: (skus: string[]) => void;
}

export type QuickOrderContentProps = Omit<
  QuickOrderProps,
  'downloadLink' | 'handleSKUsUpdate' | 'csvProducts' | 'csvProductsLoading'
>;

export interface QuickOrderDesktopProps extends QuickOrderProps {
  downloadLink: string;
  handleSKUsUpdate?: (skus: string[]) => void;
}

export interface ProductItemProps {
  quantity: number;
  product: ProductSuggestion;
  handleQuantityChange: (product: ProductSuggestion, value: number) => void;
}

export interface QuickOrderCSVUploadProps {
  downloadLink: string;
  csvProducts: Product[];
  csvProductsLoading: boolean;
  onClose?: () => void;
  handleSKUsUpdate?: (skus: string[]) => void;
  addItemDisabled?: boolean;
  addItem?: (
    lineItems: Array<{
      sku: string;
      count: number;
    }>,
  ) => Promise<object>;
}

export interface contextShape {
  downloadLink: string;
  files: File[];
  fileError: Record<string, string>;
  loading: Record<string, boolean>;
  loadingProgress: Record<string, number>;
  handleClearFiles: () => void;
  handleClearReadFiles: () => void;
  handleRemoveClick: (removedFile: File) => void;
  addToCartLoading: boolean;
  products: Product[];
  productsLoading: boolean;
  checked: Record<string, boolean>;
  handleAddToCart: () => void;
  onCheckboxChange: (product: Product, value: boolean) => void;
  handleUploadClick: (files: File[]) => void;
  handleProductClear: () => void;
  handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
