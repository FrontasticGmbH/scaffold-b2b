import { Address } from './address';
import { Associate } from './associate';

export interface Store {
  id: string;
  name: string;
  key: string;
}

export interface BusinessUnit {
  id: string;
  name: string;
  key: string;
  email: string;
  stores?: Store[];
  addresses: Address[];
  topLevelUnit?: BusinessUnit;
  parentUnit?: BusinessUnit;
  associates: Associate[];
}
