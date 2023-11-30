import { Account } from '../account/Account';

export interface AssociateRole {
  associateRoleId?: string;
  key?: string;
  name?: string;
}

export interface Associate extends Account {
  roles?: AssociateRole[];
}
