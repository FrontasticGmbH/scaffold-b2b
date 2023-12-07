'use client';

import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import { Account } from '@shared/types/account/Account';
import { sdk } from '@/sdk';
import { Address } from '@shared/types/account/Address';
import { GetAccountActionReturn } from '@/sdk/composable-commerce-b2b/types/actions/AccountActions';
import { RegisterAccountPayload } from '@/sdk/composable-commerce-b2b/types/payloads/AccountPayloads';

const useAccount = () => {
  const getAccount = useCallback(async () => {
    const result = await sdk.composableCommerce.account.getAccount();
    return result;
  }, []);

  const result = useSWR('/action/account/getAccount', getAccount);

  const getData = useCallback(() => {
    if (result.data?.isError) return { loggedIn: false } as GetAccountActionReturn;

    return (result.data?.data ?? {}) as GetAccountActionReturn;
  }, [result]);

  const data = getData();

  const defaultShippingAddress = data.loggedIn
    ? data.account?.addresses?.find((address) => address.isDefaultShippingAddress)
    : undefined;

  const defaultBillingAddress = data.loggedIn
    ? data.account?.addresses?.find((address) => address.isDefaultBillingAddress)
    : undefined;

  const updateAccount = useCallback(async (payload: Partial<Account>): Promise<Account> => {
    const res = await sdk.composableCommerce.account.updateAccount(payload);

    mutate('/action/account/getAccount');

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const login = useCallback(async (email: string, password: string, remember?: boolean): Promise<Account> => {
    const res = await sdk.composableCommerce.account.login({ email, password, remember });

    mutate('/action/account/getAccount');
    mutate('/action/wishlist/getWishlist');

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const logout = useCallback(async () => {
    await sdk.composableCommerce.account.logout();

    mutate('/action/account/getAccount');
    mutate('/action/wishlist/getWishlist');
  }, []);

  const register = useCallback(async (account: Account): Promise<Account> => {
    const res = await sdk.composableCommerce.account.register(account as RegisterAccountPayload);

    if (res.isError) throw new Error(res.error.message);

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const requestConfirmationEmail = useCallback(async (email: string, password: string): Promise<void> => {
    await sdk.composableCommerce.account.requestConfirmationEmail({ email, password });
  }, []);

  const confirm = useCallback(async (token: string): Promise<Account> => {
    const res = await sdk.composableCommerce.account.confirm({ token });

    mutate('/action/account/getAccount');

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const requestPasswordReset = useCallback(async (email: string): Promise<void> => {
    await sdk.composableCommerce.account.requestPasswordReset({ email });
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string): Promise<Account> => {
    const res = await sdk.composableCommerce.account.resetPassword({ token, newPassword });

    mutate('/action/account/getAccount');

    return res.isError ? ({} as Account) : (res.data as Account);
  }, []);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    const res = await sdk.composableCommerce.account.changePassword({ oldPassword, newPassword });

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const deleteAccount = useCallback(async (password: string) => {
    const res = await sdk.composableCommerce.account.deleteAccount({ password });

    mutate('/action/account/getAccount');

    return { success: !res.isError };
  }, []);

  const addAddress = useCallback(async (address: Address) => {
    const res = await sdk.composableCommerce.account.addAddress({ address });

    mutate('/action/account/getAccount');

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const updateAddress = useCallback(async (address: Partial<Address>) => {
    const res = await sdk.composableCommerce.account.updateAddress({ address });

    mutate('/action/account/getAccount');

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const removeAddress = useCallback(async (addressId: string) => {
    const res = await sdk.composableCommerce.account.removeAddress({ address: { id: addressId } });

    mutate('/action/account/getAccount');

    return res.isError ? ({} as Account) : res.data;
  }, []);

  return {
    account: data.loggedIn ? data.account : undefined,
    loggedIn: !!data.loggedIn,
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
