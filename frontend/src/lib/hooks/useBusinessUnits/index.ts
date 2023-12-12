import { useCallback } from 'react';
import { sdk } from '@/sdk';
import useSWR from 'swr';
import { BusinessUnit } from '@shared/types/business-unit/BusinessUnit';
import { Associate } from '@/types/entity/associate';
import { Account } from '@shared/types/account/Account';
import { Store } from '@shared/types/store/Store';

const useBusinessUnits = () => {
  const { data, mutate: mutateBusinessUnits } = useSWR('/action/business-unit/getBusinessUnits', () =>
    sdk.callAction<BusinessUnit[]>({ actionName: 'business-unit/getBusinessUnits' }),
  );

  const addBusinessUnit = useCallback(
    async (payload: { account: Account; store: Store }) => {
      const response = await sdk.callAction<BusinessUnit>({ actionName: 'business-unit/create', payload });

      mutateBusinessUnits();

      return !response.isError && response.data;
    },
    [mutateBusinessUnits],
  );

  const removeBusinessUnit = useCallback(
    async (key: string) => {
      const response = await sdk.callAction<BusinessUnit>({ actionName: 'business-unit/remove', query: { key } });

      mutateBusinessUnits();

      return !response.isError && response.data;
    },
    [mutateBusinessUnits],
  );

  const addAssociate = useCallback(
    async ({ email, role, businessUnit }: Partial<Associate> & { businessUnit: string }) => {
      const response = await sdk.callAction({
        actionName: 'business-unit/addAssociate',
        payload: { email, roleKeys: [role] },
        query: { key: businessUnit },
      });

      mutateBusinessUnits();

      return !response.isError && response.data;
    },
    [mutateBusinessUnits],
  );

  const updateAssociate = useCallback(
    async ({ id, role, businessUnit }: Partial<Associate> & { businessUnit: string }) => {
      const response = await sdk.callAction({
        actionName: 'business-unit/updateAssociate',
        payload: { accountId: id, roleKeys: [role] },
        query: { key: businessUnit },
      });

      mutateBusinessUnits();

      return !response.isError && response.data;
    },
    [mutateBusinessUnits],
  );

  const removeAssociate = useCallback(
    async ({ id, businessUnit }: Partial<Associate> & { businessUnit: string }) => {
      const response = await sdk.callAction({
        actionName: 'business-unit/removeAssociate',
        payload: { accountId: id },
        query: { key: businessUnit },
      });

      mutateBusinessUnits();

      return !response.isError && response.data;
    },
    [mutateBusinessUnits],
  );

  return {
    businessUnits: data?.isError ? [] : data?.data ?? [],
    defaultBusinessUnit: data?.isError ? undefined : data?.data[0],
    addBusinessUnit,
    removeBusinessUnit,
    addAssociate,
    updateAssociate,
    removeAssociate,
  };
};

export default useBusinessUnits;
