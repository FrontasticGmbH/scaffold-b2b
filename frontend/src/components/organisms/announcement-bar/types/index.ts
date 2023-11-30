import { Option } from '@/components/atoms/select/types';
import { NavigationCategory } from '../../header/types';

export interface AnnouncementBarProps {
  myAccount: NavigationCategory;
  textBar: string;
  businessUnits: Option[];
  stores: Option[];
  name: string;
  quotas: string;
  onLogoutClick: () => void;
}

export interface AccountButtonProps {
  name: string;
  businessUnits: Option[];
  stores: Option[];
  myAccount: NavigationCategory;
  onLogoutClick: () => void;
  quotas: string;
}
export interface ButtonProps {
  onOpen: () => void;
}
