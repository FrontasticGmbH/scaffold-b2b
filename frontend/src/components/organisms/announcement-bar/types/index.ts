import { Option } from '@/components/atoms/select/types';
import { NavigationCategory } from '../../header/types';

export interface AnnouncementBarProps {
  accountLinks: NavigationCategory[];
  textBar: string;
  selectedBusinessUnit: string;
  businessUnits: Option[];
  selectedStore: string;
  stores: Option[];
  name: string;
  quotes: number;
  onLogoutClick: () => void;
  onBusinessUnitChange?: (businessUnit: string) => void;
  onStoreChange?: (store: string) => void;
}

export interface AccountButtonProps {
  quotes: number;
  name: string;
  selectedBusinessUnit: string;
  businessUnits: Option[];
  selectedStore: string;
  stores: Option[];
  accountLinks: NavigationCategory[];
  onLogoutClick: () => void;
  onBusinessUnitChange?: (businessUnit: string) => void;
  onStoreChange?: (store: string) => void;
}
export interface ButtonProps {
  onOpen: () => void;
}
