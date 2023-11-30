import { useCallback } from 'react';
import { sdk } from '@/sdk';
import useSWR from 'swr';
import { Associate } from '@/types/entity/associate';

const useBusinessUnits = () => {
  const { data, mutate: mutateBusinessUnits } = useSWR('/action/business-unit/getBusinessUnits', () =>
    sdk.composableCommerce.businessUnit.getBusinessUnits(),
  );

  const addBusinessUnit = useCallback(
    async (payload: {
      account: {
        accountId: string;
        email: string;
        companyName: string;
      };
      storeId: string;
    }) => {
      const response = await sdk.composableCommerce.businessUnit.createBusinessUnit({
        account: payload.account,
        store: {
          storeId: payload.storeId,
        },
      });

      mutateBusinessUnits();

      return response.isError ? {} : response.data;
    },
    [mutateBusinessUnits],
  );

  const updateBusinessUnit = useCallback(
    async (payload: { name: string; contactEmail: string; key: string }) => {
      const response = await sdk.composableCommerce.businessUnit.updateBusinessUnit(
        {
          name: payload.name,
          contactEmail: payload.contactEmail,
        },
        { key: payload.key },
      );

      mutateBusinessUnits();

      return response.isError ? {} : response.data;
    },
    [mutateBusinessUnits],
  );

  const removeBusinessUnit = useCallback(
    async (key: string) => {
      const response = await sdk.composableCommerce.businessUnit.removeBusinessUnit({ key });

      mutateBusinessUnits();

      return response.isError ? {} : response.data;
    },
    [mutateBusinessUnits],
  );

  const addAssociate = useCallback(
    async ({ email, role, businessUnit }: Partial<Associate> & { businessUnit: string }) => {
      const response = await sdk.composableCommerce.businessUnit.addAssociate(
        { email: email as string, roleKeys: [role as string] },
        { key: businessUnit },
      );

      mutateBusinessUnits();

      return response.isError ? {} : response.data;
    },
    [mutateBusinessUnits],
  );

  const updateAssociate = useCallback(
    async ({ id, role, businessUnit }: Partial<Associate> & { businessUnit: string }) => {
      const response = await sdk.composableCommerce.businessUnit.updateAssociate(
        { accountId: id as string, roleKeys: [role as string] },
        { key: businessUnit },
      );

      mutateBusinessUnits();

      return response.isError ? {} : response.data;
    },
    [mutateBusinessUnits],
  );

  const removeAssociate = useCallback(
    async ({ id, businessUnit }: Partial<Associate> & { businessUnit: string }) => {
      const response = await sdk.composableCommerce.businessUnit.removeAssociate(
        { accountId: id ?? '' },
        { key: businessUnit },
      );

      mutateBusinessUnits();

      return response.isError ? {} : response.data;
    },
    [mutateBusinessUnits],
  );

  return {
    businessUnits: data?.isError ? [] : data?.data ?? [],
    defaultBusinessUnit: data?.isError ? undefined : data?.data[0],
    addBusinessUnit,
    updateBusinessUnit,
    removeBusinessUnit,
    addAssociate,
    updateAssociate,
    removeAssociate,
  };
};

export default useBusinessUnits;