import { Address } from '@/types/entity/address';
import { Associate } from '@/types/entity/associate';
import { BusinessUnit } from '@/types/entity/business-unit';

export interface Props {
  addresses: Address[];
  associates: Associate[];
  businessUnits: BusinessUnit[];
}
