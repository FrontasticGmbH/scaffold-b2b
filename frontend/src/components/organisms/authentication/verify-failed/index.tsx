'use client';

import Typography from '@/components/atoms/typography';
import { useTranslations } from 'use-intl';
import AuthLayout from '../layouts/auth-layout';
import { AuthLayoutProps } from '../types';

const VerifyFailed = (props: AuthLayoutProps & { isAlreadyVerified?: boolean }) => {
  const translate = useTranslations();

  return (
    <AuthLayout {...props}>
      <div className="grid gap-3 md:gap-4 lg:gap-5">
        <Typography as="h1" fontSize={18} fontWeight="extrabold" className="text-red-500">
          {translate('error.verify-failed')}
        </Typography>
        <Typography fontSize={14} className="text-gray-600" lineHeight="loose">
          {props.isAlreadyVerified
            ? translate('error.verify-failed-already-verified')
            : translate('error.verify-failed-description')}
        </Typography>
      </div>
    </AuthLayout>
  );
};

export default VerifyFailed;
