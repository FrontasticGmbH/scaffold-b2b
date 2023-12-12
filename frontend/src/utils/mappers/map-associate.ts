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
    lastName,
    email: email ?? '',
    role: roles?.[0].key ?? '',
    status: confirmed ? 'confirmed' : 'pending',
  };
};
