import { Associate } from '@shared/types/business-unit/Associate';
import { Associate as EntityAssociate } from '@/types/entity/associate';

export const mapAssociate = ({
  accountId,
  firstName,
  lastName,
  email,
  roles,
  confirmed,
}: Associate): EntityAssociate => {
  return {
    id: accountId as string,
    firstName: firstName ?? '',
    lastName: lastName ?? '',
    email: email ?? '',
    roles: (roles ?? []).filter((role) => !!role.key).map((role) => role.key as string),
    status: confirmed ? 'confirmed' : 'pending',
  };
};
