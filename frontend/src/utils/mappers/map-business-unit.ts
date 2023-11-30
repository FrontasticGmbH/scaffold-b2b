import { BusinessUnit } from '@shared/types/business-unit/BusinessUnit';
import { BusinessUnit as EntityBusinessUnit } from '@/types/entity/business-unit';

export const mapBusinessUnit = ({ businessUnitId, key, name, contactEmail }: BusinessUnit): EntityBusinessUnit => {
  return {
    id: businessUnitId as string,
    name: name ?? '',
    key: key ?? '',
    email: contactEmail ?? '',
  };
};
