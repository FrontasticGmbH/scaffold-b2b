'use client';

import React from 'react';
import Login from '@/components/organisms/authentication/login';
import useAccount from '@/lib/hooks/useAccount';
import { AuthLayoutProps } from '@/components/organisms/authentication/types';
import { TasticProps } from '../../types';

const AccountLoginTastic = ({ data }: TasticProps<AuthLayoutProps>) => {
  const { login, requestPasswordReset } = useAccount();

  return <Login login={login} requestPasswordReset={requestPasswordReset} {...data} />;
};

export default AccountLoginTastic;
