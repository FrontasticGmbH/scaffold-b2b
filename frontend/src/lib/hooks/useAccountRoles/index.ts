import useSWR from 'swr';
import { sdk } from '@/sdk';
import { Permission } from '@shared/types/business-unit/Associate';

const useAccountRoles = (businessUnitKey?: string) => {
  const defaultResponse = useSWR('/action/business-unit/getAssociate', () =>
    sdk.composableCommerce.businessUnit.getAssociate({ businessUnitKey: businessUnitKey as string }),
  );

  const response = useSWR(businessUnitKey ? ['/action/business-unit/getAssociate', businessUnitKey] : undefined, () =>
    sdk.composableCommerce.businessUnit.getAssociate({ businessUnitKey: businessUnitKey as string }),
  );

  const defaultData = defaultResponse.data?.isError ? null : (defaultResponse.data?.data ?? null);
  const dataCorrespondingToBu = response.data?.isError ? null : (response.data?.data ?? null);

  const data = defaultData ?? dataCorrespondingToBu ?? {};

  const roles = data.roles ?? [];

  const isAdmin = roles.findIndex((role) => role.key === 'admin') !== -1;

  const rolePermissions = roles.reduce((acc, curr) => [...acc, ...(curr.permissions ?? [])], [] as Permission[]);

  const permissions = rolePermissions.reduce(
    (acc, permission) => ({
      ...acc,
      [permission]: true,
    }),
    {} as Record<Permission, boolean>,
  );

  return { roles, isAdmin, permissions };
};

export default useAccountRoles;
