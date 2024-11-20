import { BusinessUnit } from '@shared/types/business-unit/BusinessUnit';
import { BusinessUnit as EntityBusinessUnit } from '@/types/entity/business-unit';
import { mapAddress } from './map-address';
import { mapStore } from './map-store';
import { mapAssociate } from './map-associate';

export const mapBusinessUnit = ({
  businessUnitId,
  key,
  name,
  contactEmail,
  addresses,
  stores,
  topLevelUnit,
  parentUnit,
  associates,
}: BusinessUnit): EntityBusinessUnit => {
  return {
    id: businessUnitId as string,
    name: name ?? '',
    key: key ?? '',
    email: contactEmail ?? '',
    addresses: (addresses ?? []).map(mapAddress),
    stores: (stores ?? []).map(mapStore),
    topLevelUnit: topLevelUnit && topLevelUnit.key !== key ? mapBusinessUnit(topLevelUnit) : undefined,
    parentUnit: parentUnit && parentUnit.key !== key ? mapBusinessUnit(parentUnit) : undefined,
    associates: (associates ?? []).map(mapAssociate),
  };
};
