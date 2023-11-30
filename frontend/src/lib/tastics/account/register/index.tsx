'use client';

import React from 'react';
import Register from '@/components/organisms/authentication/register';
import useAccount from '@/lib/hooks/useAccount';
import { AuthLayoutProps } from '@/components/organisms/authentication/types';
import { TasticProps } from '../../types';

const AccountRegisterTastic = ({ data }: TasticProps<AuthLayoutProps>) => {
  const { register, login } = useAccount();

  return <Register register={register} login={login} {...data} />;
};

export default AccountRegisterTastic;
