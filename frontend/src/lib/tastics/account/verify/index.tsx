import React from 'react';
import { redirect } from 'next/navigation';
import { sdk } from '@/sdk';
import { AuthLayoutProps } from '@/components/organisms/authentication/types';
import VerifyFailed from '@/components/organisms/authentication/verify-failed';
import { ProjectSettings } from '@shared/types/ProjectSettings';
import { TasticProps } from '../../types';

const VerifyTastic = async ({ data, params, searchParams, projectSettings }: TasticProps<AuthLayoutProps>) => {
  const { locale } = params;

  const { token } = searchParams;

  const response = await sdk.composableCommerce.account.confirm({ token: token as string });

  const isAlreadyVerified =
    response.isError &&
    response.error.message ===
      `Error: URI not found: /${(projectSettings as (ProjectSettings & { projectKey: string }) | undefined)?.projectKey}/customers/email/confirm`;

  if (!response.isError) redirect(`/${locale}/login/`);
  else return <VerifyFailed {...data} isAlreadyVerified={isAlreadyVerified} />;
};

export default VerifyTastic;
