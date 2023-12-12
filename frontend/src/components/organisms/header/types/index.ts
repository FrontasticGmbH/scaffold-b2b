import { Link } from '@/types/link';
import { Image as LogoImage } from '@/types/image';
import { Option } from '@/components/atoms/select/types';
import { Category } from '@/types/entity/category';
import { Suggestion } from '../../search/types';

export type NavigationCategory = Category;

export interface HeaderProps {
  myAccount: NavigationCategory;
  cartItems: number;
  cartLink: Link;
  accountLink: Link;
  pageLinks: Link[];
  categoryLinks: NavigationCategory[];
  logo: LogoImage;
  logoLink: Link;
  businessUnits: Option[];
  stores: Option[];
  searchSuggestions: Suggestion[];
  quickOrderProducts: Suggestion[];
  searchPlaceholder: string;
  quotas: number;
  csvDownloadLink: string;
}

export interface ContextShape {
  myAccount: NavigationCategory;
  cartItems: number;
  cartLink: Link;
  accountLink: Link;
  pageLinks: Link[];
  categoryLinks: NavigationCategory[];
  logo: LogoImage;
  logoLink: Link;
  businessUnits: Option[];
  stores: Option[];
  quotas: number;
  quickOrderProducts: Suggestion[];
}

export interface NavigationButtonProps {
  lastIndex?: boolean;
  link: Category;
  onClick: () => void;
}
