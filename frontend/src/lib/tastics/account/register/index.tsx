'use client';

import React from 'react';
import Register from '@/components/organisms/authentication/register';
import useAccount from '@/lib/hooks/useAccount';
import { AuthLayoutProps } from '@/components/organisms/authentication/types';
import { TasticProps } from '../../types';

const AccountRegisterTastic = ({ data }: TasticProps<AuthLayoutProps>) => {
  const { register } = useAccount();

  return <Register register={register} {...data} />;
};

export default AccountRegisterTastic;
