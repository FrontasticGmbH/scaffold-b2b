import React from 'react';
import { redirect } from 'next/navigation';
import { sdk } from '@/sdk';
import { AuthLayoutProps } from '@/components/organisms/authentication/types';
import VerifyFailed from '@/components/organisms/authentication/verify-failed';
import { TasticProps } from '../../types';

const VerifyTastic = async ({ data, params, searchParams }: TasticProps<AuthLayoutProps>) => {
  const { locale } = params;

  const { token } = searchParams;

  const response = await sdk.composableCommerce.account.confirm({ token: token as string });

  if (!response.isError) redirect(`/${locale}/login/`);
  else return <VerifyFailed {...data} />;
};

export default VerifyTastic;
