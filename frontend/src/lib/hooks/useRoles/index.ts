import { useCallback } from 'react';
import { sdk } from '@/sdk';
import useSWR from 'swr';

const useRoles = () => {
  const getRoles = useCallback(() => {
    return sdk.composableCommerce.businessUnit.getAssociateRoles();
  }, []);

  const response = useSWR('/action/buinsess-unit/getAssociateRoles', getRoles);

  return { ...response, data: response.data?.isError ? [] : response.data?.data ?? [] };
};

export default useRoles;
