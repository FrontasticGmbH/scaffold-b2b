import React from 'react';
import { redirect } from 'next/navigation';
import { sdk } from '@/sdk';
import { AuthLayoutProps } from '@/components/organisms/authentication/types';
import VerifyFailed from '@/components/organisms/authentication/verify-failed';
import { TasticProps } from '../../types';

const VerifyTastic = async ({ data, searchParams }: TasticProps<AuthLayoutProps>) => {
  const { token } = searchParams;

  const response = await sdk.callAction({
    actionName: 'account/confirm',
    payload: { token },
  });

  if (!response.isError) redirect('/login');
  else return <VerifyFailed {...data} />;
};

export default VerifyTastic;
