'use client';

import React from 'react';
import Login from '@/components/organisms/authentication/login';
import useAccount from '@/lib/hooks/useAccount';
import { AuthLayoutProps } from '@/components/organisms/authentication/types';
import Redirect from '@/components/headless/redirect';
import { TasticProps } from '../../types';

const AccountLoginTastic = ({ data }: TasticProps<AuthLayoutProps>) => {
  const { loggedIn, login, requestPasswordReset } = useAccount();

  if (loggedIn) return <Redirect to="/" />;

  return <Login login={login} requestPasswordReset={requestPasswordReset} {...data} />;
};

export default AccountLoginTastic;
