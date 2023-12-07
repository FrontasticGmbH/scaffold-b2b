import { Link } from '@/types/link';
import { Image as LogoImage } from '@/types/image';
import { Option } from '@/components/atoms/select/types';
import { Category } from '@/types/entity/category';
import { Suggestion } from '../../search/types';

export type NavigationCategory = Category;

export interface HeaderProps {
  isAdmin: boolean;
  myAccountMenu: NavigationCategory;
  cartItems: number;
  cartLink: Link;
  accountLink: Link;
  pageLinks: Link[];
  categoryLinks: NavigationCategory[];
  logo: LogoImage;
  logoLink: Link;
  selectedBusinessUnit: string;
  businessUnits: Option[];
  onBusinessUnitChange?: (businessUnit: string) => void;
  selectedStore: string;
  stores: Option[];
  onStoreChange?: (store: string) => void;
  searchSuggestions: Suggestion[];
  quickOrderProducts: Suggestion[];
  searchPlaceholder: string;
  quotes: number;
  csvDownloadLink: string;
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
  selectedBusinessUnit: string;
  businessUnits: Option[];
  onBusinessUnitChange?: (businessUnit: string) => void;
  selectedStore: string;
  stores: Option[];
  onStoreChange?: (store: string) => void;
  quotes: number;
  quickOrderProducts: Suggestion[];
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
