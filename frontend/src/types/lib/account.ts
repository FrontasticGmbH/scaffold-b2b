import { Account } from '@shared/types/account/Account';

export interface AccountResult {
  account?: Account;
  loggedIn?: boolean;
}
