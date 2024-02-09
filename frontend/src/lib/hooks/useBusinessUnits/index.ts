import { useCallback } from 'react';
import { sdk } from '@/sdk';
import useSWR from 'swr';
import { Associate } from '@/types/entity/associate';
import { Address } from '@shared/types/account';

const useBusinessUnits = () => {
  const { data, mutate: mutateBusinessUnits } = useSWR('/action/business-unit/getBusinessUnits', () =>
    sdk.composableCommerce.businessUnit.getBusinessUnits({ expandStores: true }),
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
    async (payload: { name: string; contactEmail: string; businessUnitKey: string }) => {
      const response = await sdk.composableCommerce.businessUnit.updateBusinessUnit(
        {
          name: payload.name,
          contactEmail: payload.contactEmail,
        },
        { businessUnitKey: payload.businessUnitKey },
      );

      mutateBusinessUnits();

      return response.isError ? {} : response.data;
    },
    [mutateBusinessUnits],
  );

  const addAssociate = useCallback(
    async ({ email, role, businessUnitKey }: Partial<Associate> & { businessUnitKey: string }) => {
      const response = await sdk.composableCommerce.businessUnit.addAssociate(
        { email: email as string, roleKeys: [role as string] },
        { businessUnitKey },
      );

      mutateBusinessUnits();

      return response.isError ? {} : response.data;
    },
    [mutateBusinessUnits],
  );

  const updateAssociate = useCallback(
    async ({ id, role, businessUnitKey }: Partial<Associate> & { businessUnitKey: string }) => {
      const response = await sdk.composableCommerce.businessUnit.updateAssociate(
        { accountId: id as string, roleKeys: [role as string] },
        { businessUnitKey },
      );

      mutateBusinessUnits();

      return response.isError ? {} : response.data;
    },
    [mutateBusinessUnits],
  );

  const removeAssociate = useCallback(
    async ({ id, businessUnitKey }: Partial<Associate> & { businessUnitKey: string }) => {
      const response = await sdk.composableCommerce.businessUnit.removeAssociate(
        { accountId: id ?? '' },
        { businessUnitKey },
      );

      mutateBusinessUnits();

      return response.isError ? {} : response.data;
    },
    [mutateBusinessUnits],
  );

  const addAddress = useCallback(
    async ({ businessUnitKey, ...address }: Address & { businessUnitKey: string }) => {
      const response = await sdk.composableCommerce.businessUnit.addAddress({ address }, { businessUnitKey });

      mutateBusinessUnits();

      return response.isError ? {} : response.data;
    },
    [mutateBusinessUnits],
  );

  const updateAddress = useCallback(
    async ({ businessUnitKey, ...address }: Address & { businessUnitKey: string }) => {
      const response = await sdk.composableCommerce.businessUnit.updateAddress({ address }, { businessUnitKey });

      mutateBusinessUnits();

      return response.isError ? {} : response.data;
    },
    [mutateBusinessUnits],
  );

  const removeAddress = useCallback(
    async ({ businessUnitKey, addressId }: { addressId: string; businessUnitKey: string }) => {
      const response = await sdk.composableCommerce.businessUnit.removeAddress({ addressId }, { businessUnitKey });

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
    addAssociate,
    updateAssociate,
    removeAssociate,
    addAddress,
    updateAddress,
    removeAddress,
  };
};

export default useBusinessUnits;
