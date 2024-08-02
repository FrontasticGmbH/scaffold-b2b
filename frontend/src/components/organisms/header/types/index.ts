import { Link } from '@/types/link';
import { Image as LogoImage } from '@/types/image';
import { Option } from '@/components/atoms/select/types';
import { Category } from '@/types/entity/category';
import { Product as CsvProduct } from '@/components/organisms/quick-order/types';
import { ProductSuggestion } from '../../search/types';

export type NavigationCategory = Category;

export type HeaderVariant = 'account' | 'navigation' | 'checkout';

export interface HeaderProps {
  variant: HeaderVariant;
  isAdmin: boolean;
  myAccountMenu: NavigationCategory;
  cartItems: number;
  cartLink: Link;
  accountLink: Link;
  pageLinks: Link[];
  categoryLinks: NavigationCategory[];
  logo: LogoImage;
  logoLink: Link;
  selectedBusinessUnit?: string;
  businessUnits: Option[];
  selectedStore?: string;
  stores: Option[];
  searchSuggestions: ProductSuggestion[];
  quickOrderProducts: ProductSuggestion[];
  searchPlaceholder: string;
  quotes: number;
  csvDownloadLink: string;
  quickOrderSearch: string;
  headerSearch: string;
  csvShowProducts: CsvProduct[];
  csvShowProductsLoading: boolean;
  addToCartDisabled?: boolean;
  onBusinessUnitChange?: (businessUnit: string) => void;
  onStoreChange?: (store: string) => void;
  onQuickOrderSearch?: (value: string) => void;
  onHeaderSearch?: (value: string) => void;
  onHeaderSearchAction?: () => void;
  handleSKUsUpdate?: (skus: string[]) => void;
  addToCart?: (
    lineItems: {
      sku: string;
      count: number;
    }[],
  ) => Promise<object>;
}

export interface ContextProps {
  isAdmin: boolean;
  myAccountMenu: NavigationCategory;
  cartItems: number;
  cartLink: Link;
  accountLink: Link;
  pageLinks: Link[];
  categoryLinks: NavigationCategory[];
  logo: LogoImage;
  logoLink: Link;
  selectedBusinessUnit?: string;
  businessUnits: Option[];
  selectedStore?: string;
  stores: Option[];
  quotes: number;
  quickOrderProducts: ProductSuggestion[];
  quickOrderSearch: string;
  addToCartDisabled?: boolean;
  onBusinessUnitChange?: (businessUnit: string) => void;
  onStoreChange?: (store: string) => void;
  onQuickOrderSearch?: (value: string) => void;
  onHeaderSearch?: (value: string) => void;
  addToCart?: (
    lineItems: {
      sku: string;
      count: number;
    }[],
  ) => Promise<object>;
}

export interface ContextShape extends ContextProps {
  navigationLevel: Category[];
  showMenu: boolean;
  showHeaderMenu: () => void;
  hideHeaderMenu: () => void;
  showQuickOrder: boolean;
  showQuickOrderMenu: () => void;
  hideQuickOrderMenu: () => void;
  removeCategory: () => void;
  insertCategory: (category: NavigationCategory) => void;
}

export interface NavigationButtonProps {
  lastIndex?: boolean;
  link: Category;
  onClick: () => void;
}

export interface QuickOrderMobileProps {
  showQuickOrderMenu: () => void;
}
