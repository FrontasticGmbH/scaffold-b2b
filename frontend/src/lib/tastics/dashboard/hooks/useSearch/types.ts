import { Address } from '@shared/types/account/Address';
import { Associate } from '@shared/types/business-unit/Associate';
import { BusinessUnit } from '@shared/types/business-unit/BusinessUnit';

export interface Props {
  addresses: Address[];
  accountAddresses: Address[];
  associates: Associate[];
  businessUnits: BusinessUnit[];
}
