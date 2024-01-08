'use client';

import React from 'react';
import ResetPassword from '@/components/organisms/authentication/reset-password';
import { AuthLayoutProps } from '@/components/organisms/authentication/types';
import useAccount from '@/lib/hooks/useAccount';
import Redirect from '@/components/headless/redirect';
import { TasticProps } from '../../types';

const ResetPasswordTastic = ({ data }: TasticProps<AuthLayoutProps>) => {
  const { loggedIn, resetPassword } = useAccount();

  if (loggedIn) return <Redirect to="/" />;

  return <ResetPassword resetPassword={resetPassword} {...data} />;
};

export default ResetPasswordTastic;
