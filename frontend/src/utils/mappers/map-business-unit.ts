import { BusinessUnit } from '@shared/types/business-unit/BusinessUnit';
import { BusinessUnit as EntityBusinessUnit } from '@/types/entity/business-unit';
import { mapAddress } from './map-address';

export const mapBusinessUnit = ({
  businessUnitId,
  key,
  name,
  contactEmail,
  addresses,
}: BusinessUnit): EntityBusinessUnit => {
  return {
    id: businessUnitId as string,
    name: name ?? '',
    key: key ?? '',
    email: contactEmail ?? '',
    addresses: (addresses ?? []).map(mapAddress),
  };
};
