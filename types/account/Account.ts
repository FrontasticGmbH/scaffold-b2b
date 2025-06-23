import { Address } from './Address';
import { AccountToken } from './AccountToken';

export interface Account {
  accountId?: string;
  accountVersion?: number;
  email?: string;
  salutation?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  birthday?: Date;
  password?: string;
  confirmationToken?: AccountToken;
  confirmed?: boolean;
  addresses?: Address[];
  apiToken?: string;
  vatNumber?: string;
  accountGroupIds?: string[];
}

export interface AccountGroup {
  accountGroupId?: string;
  key?: string;
  name?: string;
}
