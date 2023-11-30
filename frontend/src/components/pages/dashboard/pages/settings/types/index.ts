import { Option } from '@/components/atoms/select/types';
import { Account } from '@/types/entity/account';

export interface SettingsPageProps {
  account: Account;
  onUpdateAccount?: (account: Partial<Account>) => Promise<void>;
  businessUnitOptions: Option[];
  roleOptions: Option[];
  isAdmin?: boolean;
  onUpdateNewsletterPreferences?: (subscribe: boolean) => Promise<void>;
  onChangePassword?: (oldPassword: string, newPassword: string) => Promise<void>;
  onDeleteAccount?: (password: string) => Promise<boolean>;
}
