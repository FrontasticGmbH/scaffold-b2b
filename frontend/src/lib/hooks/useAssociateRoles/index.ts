import { sdk } from '@/sdk';
import useSWR from 'swr';

const useAssociateRoles = () => {
  const response = useSWR('/action/business-unit/getAssociateRoles', () =>
    sdk.composableCommerce.businessUnit.getAssociateRoles(),
  );

  const roles = response.data?.isError ? [] : response.data?.data;

  return roles ?? [];
};

export default useAssociateRoles;
