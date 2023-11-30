'use client';

import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import { Account } from '@shared/types/account/Account';
import { sdk } from '@/sdk';
import { Address } from '@shared/types/account/Address';
import { AccountResult } from '@/types/lib/account';

const useAccount = () => {
  const getAccount = useCallback(async () => {
    const result = sdk.callAction<AccountResult>({ actionName: 'account/getAccount' });
    return result;
  }, []);

  const result = useSWR('/action/account/getAccount', getAccount);

  const getData = useCallback(() => {
    if (result.data?.isError) return { loggedIn: false };

    return result.data?.data ?? {};
  }, [result]);

  const data = getData();

  const defaultShippingAddress = data.account?.addresses?.find((address) => address.isDefaultShippingAddress);

  const defaultBillingAddress = data.account?.addresses?.find((address) => address.isDefaultBillingAddress);

  const updateAccount = useCallback(async (payload: Partial<Account>): Promise<Account> => {
    const res = await sdk.callAction<Account>({
      actionName: 'account/update',
      payload,
    });

    mutate('/action/account/getAccount');

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const login = useCallback(async (email: string, password: string, remember?: boolean): Promise<Account> => {
    const payload = {
      email,
      password,
      remember,
    };

    const res = await sdk.callAction<Account>({
      actionName: 'account/login',
      payload,
    });

    mutate('/action/account/getAccount');
    mutate('/action/wishlist/getWishlist');

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const logout = useCallback(async () => {
    await sdk.callAction({
      actionName: 'account/logout',
    });

    mutate('/action/account/getAccount');
    mutate('/action/wishlist/getWishlist');
  }, []);

  const register = useCallback(async (account: Account): Promise<Account> => {
    const res = await sdk.callAction<Account>({
      actionName: 'account/register',
      payload: account,
    });

    if (res.isError) {
      throw new Error(res.error.message);
    }

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const requestConfirmationEmail = useCallback(async (email: string, password: string): Promise<void> => {
    const payload = {
      email,
      password,
    };

    await sdk.callAction({ actionName: 'account/requestConfirmationEmail', payload });
  }, []);

  const confirm = useCallback(async (token: string): Promise<Account> => {
    const res = await sdk.callAction<Account>({
      actionName: 'account/confirm',
      payload: { token },
    });

    mutate('/action/account/getAccount');

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const requestPasswordReset = useCallback(async (email: string): Promise<void> => {
    const payload = {
      email,
    };

    await sdk.callAction({ actionName: 'account/requestReset', payload });
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string): Promise<Account> => {
    const payload = {
      token,
      newPassword,
    };

    const res = await sdk.callAction({ actionName: 'account/reset', payload });

    mutate('/action/account/getAccount');

    return res.isError ? ({} as Account) : (res.data as Account);
  }, []);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    const res = await sdk.callAction<Account>({
      actionName: 'account/password',
      payload: { oldPassword, newPassword },
    });

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const deleteAccount = useCallback(async (password: string) => {
    const res = await sdk.callAction<Account>({
      actionName: 'account/deleteAccount',
      payload: { password },
    });

    mutate('/action/account/getAccount');

    return { success: !res.isError };
  }, []);

  const addAddress = useCallback(async (address: Address) => {
    const res = await sdk.callAction<Account>({ actionName: 'account/addAddress', payload: { address } });

    mutate('/action/account/getAccount');

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const updateAddress = useCallback(async (address: Partial<Address>) => {
    const res = await sdk.callAction<Account>({ actionName: 'account/updateAddress', payload: { address } });

    mutate('/action/account/getAccount');

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const removeAddress = useCallback(async (addressId: string) => {
    const res = await sdk.callAction<Account>({
      actionName: 'account/removeAddress',
      payload: { address: { id: addressId } },
    });

    mutate('/action/account/getAccount');

    return res.isError ? ({} as Account) : res.data;
  }, []);

  return {
    ...data,
    ...result,
    defaultShippingAddress,
    defaultBillingAddress,
    login,
    logout,
    register,
    requestConfirmationEmail,
    confirm,
    requestPasswordReset,
    resetPassword,
    updateAccount,
    changePassword,
    deleteAccount,
    addAddress,
    updateAddress,
    removeAddress,
  };
};

export default useAccount;
