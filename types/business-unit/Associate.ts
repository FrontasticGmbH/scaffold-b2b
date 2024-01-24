import { Account } from '../account';

export interface AssociateRole {
  key?: string;
  name?: string;
}

export interface Associate extends Account {
  roles?: AssociateRole[];
}
