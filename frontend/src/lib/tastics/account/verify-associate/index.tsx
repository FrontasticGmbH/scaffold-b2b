'use client';

import React from 'react';
import VerifyAssociate from '@/components/organisms/authentication/verify-associate';
import useAccount from '@/lib/hooks/useAccount';
import VerifyFailed from '@/components/organisms/authentication/verify-failed';
import { onSubmitVerifyAssociate } from '@/components/organisms/authentication/verify-associate/types';
import { VerifyAssociateTasticProps } from './types';

const VerifyAssociateTastic = ({ data, searchParams }: VerifyAssociateTasticProps) => {
  const { confirm, resetPassword, updateAccount } = useAccount();
  const { token, 'password-reset-token': passwordResetToken } = searchParams;

  if (!token || !passwordResetToken) return <VerifyFailed {...data} />;

  const onSubmit: onSubmitVerifyAssociate = async ({ firstName, lastName, password }) => {
    const response = await confirm(token as string);
    if (!response.accountId) {
      throw new Error('error.wentWrong');
    }

    const resetResponse = await resetPassword(passwordResetToken as string, password);
    if (!resetResponse.accountId) {
      throw new Error('error.wentWrong');
    }

    const updateResponse = await updateAccount({ firstName, lastName });
    if (!updateResponse.accountId) {
      throw new Error('error.wentWrong');
    }

    return updateResponse;
  };

  return <VerifyAssociate {...data} onSubmit={onSubmit} />;
};

export default VerifyAssociateTastic;
