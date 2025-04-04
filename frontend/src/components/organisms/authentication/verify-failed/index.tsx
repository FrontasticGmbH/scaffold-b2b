'use client';

import { useTranslations } from 'use-intl';
import AuthLayout from '../layouts/auth-layout';
import { AuthLayoutProps } from '../types';

const VerifyFailed = (props: AuthLayoutProps & { isAlreadyVerified?: boolean }) => {
  const translate = useTranslations();

  return (
    <AuthLayout {...props}>
      <div className="grid gap-3 md:gap-4 lg:gap-5">
        <h1 className="text-18 font-extrabold text-red-500">{translate('error.verify-failed')}</h1>
        <p className="text-14 leading-loose text-gray-600">
          {props.isAlreadyVerified
            ? translate('error.verify-failed-already-verified')
            : translate('error.verify-failed-description')}
        </p>
      </div>
    </AuthLayout>
  );
};

export default VerifyFailed;
