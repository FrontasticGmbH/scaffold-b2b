import { Store } from '../store/Store';
import { Address } from '../account/Address';
import { Associate } from './Associate';

export enum BusinessUnitType {
  Company = 'Company',
  Division = 'Division',
}

export enum BusinessUnitStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum StoreMode {
  Explicit = 'Explicit',
  FromParent = 'FromParent',
}

export interface BusinessUnit {
  businessUnitId?: string;
  key?: string;
  name?: string;
  status?: BusinessUnitStatus | string;
  stores?: Store[];
  storeMode?: StoreMode | string;
  unitType?: BusinessUnitType | string;
  contactEmail?: string;
  addresses?: Address[];
  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;
  associates?: Associate[];
  parentUnit?: BusinessUnit;
  topLevelUnit?: BusinessUnit;
  version?: number;
}
