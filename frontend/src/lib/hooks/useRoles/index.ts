import { useCallback } from 'react';
import { sdk } from '@/sdk';
import useSWR from 'swr';
import { AssociateRole } from '@shared/types/business-unit/Associate';

const useRoles = () => {
  const getRoles = useCallback(() => {
    return sdk.callAction<AssociateRole[]>({ actionName: 'business-unit/getAssociateRoles' });
  }, []);

  const response = useSWR('/action/buinsess-unit/getAssociateRoles', getRoles);

  return { ...response, data: response.data?.isError ? [] : response.data?.data ?? [] };
};

export default useRoles;
