'use client';

import React, { useCallback, useState } from 'react';
import Register from '@/components/organisms/authentication/register';
import useAccount from '@/lib/hooks/useAccount';
import { AuthLayoutProps } from '@/components/organisms/authentication/types';
import { TasticProps } from '../../types';

const AccountRegisterTastic = ({ data }: TasticProps<AuthLayoutProps>) => {
  const [accountId, setAccountId] = useState('');

  const { register } = useAccount();

  const handleRegister = useCallback(
    async (...params: Parameters<typeof register>) => {
      const response = await register(...params);

      if (response.accountId) setAccountId(response.accountId);

      return response;
    },
    [register],
  );

  return (
    <div data-testid={accountId ? `customer-${accountId}` : ''}>
      <Register register={handleRegister} {...data} />
    </div>
  );
};

export default AccountRegisterTastic;
