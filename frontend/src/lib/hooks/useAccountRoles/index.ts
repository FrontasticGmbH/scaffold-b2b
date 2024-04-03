import useSWR from 'swr';
import { sdk } from '@/sdk';
import { Permission } from '@shared/types/business-unit/Associate';
import useAssociateRoles from '../useAssociateRoles';

const useAccountRoles = (businessUnitKey?: string) => {
  const response = useSWR(businessUnitKey ? ['/action/business-unit/getAssociate', businessUnitKey] : undefined, () =>
    sdk.composableCommerce.businessUnit.getAssociate({ businessUnitKey: businessUnitKey as string }),
  );

  const allRoles = useAssociateRoles();

  const allPermissions = Array.from(
    new Set(allRoles.reduce((acc, curr) => [...acc, ...(curr.permissions ?? [])], [] as Permission[])),
  );

  const data = response.data?.isError ? {} : response.data?.data ?? {};

  const roles = data.roles ?? [];

  const isAdmin = roles.findIndex((role) => role.key === 'admin') !== -1;

  const rolePermissions = roles.reduce((acc, curr) => [...acc, ...(curr.permissions ?? [])], [] as Permission[]);

  const permissions = allPermissions.reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: rolePermissions.includes(curr as Permission),
    }),
    {} as Record<Permission, boolean>,
  );

  return { roles, isAdmin, permissions };
};

export default useAccountRoles;
