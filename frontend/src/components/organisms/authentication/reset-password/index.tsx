'use client';

import { ChangeEvent, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PasswordInput from '@/components/atoms/password-input';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Typography from '@/components/atoms/typography';
import AuthLayout from '../layouts/auth-layout';
import { ResetPasswordData, ResetPasswordProps } from './types';
import AuthForm from '../layouts/auth-form';

const ResetPassword = ({ image, logo, logoLink, resetPassword }: ResetPasswordProps) => {
  const searchParams = useSearchParams();

  const { translate } = useTranslation();

  const [reset, setReset] = useState(false);
  const [data, setData] = useState<ResetPasswordData>({
    password: '',
    confirmPassword: '',
  });

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = () => {
    const token = searchParams.get('token');

    if (token && data.password == data.confirmPassword) {
      resetPassword(token, data.password).then(() => {
        setReset(true);
      });
    }
  };

  return (
    <AuthLayout image={image} logo={logo} logoLink={logoLink}>
      <AuthForm
        onSubmit={handleSubmit}
        includeCheckIcon={reset}
        title={reset ? translate('account.password.reset.success') : translate('account.password.reset.headline')}
        buttonLabel={reset ? translate('account.account.login') : translate('account.password.reset.keyword')}
        footerLinkLabel={translate('account.account.back.login')}
        footerLink="/login"
      >
        {reset ? (
          <Typography fontSize={16} className="inline text-gray-600" lineHeight="loose">
            {translate('account.password.reset.success.desc')}
          </Typography>
        ) : (
          <>
            <PasswordInput
              containerClassName="w-full"
              className="w-full"
              name="password"
              label={translate('account.password')}
              value={data.password}
              onChange={handleChange}
            />
            <PasswordInput
              containerClassName="w-full"
              className="w-full"
              name="confirmPassword"
              label={translate('account.password.confirm')}
              value={data.confirmPassword}
              onChange={handleChange}
            />
          </>
        )}
      </AuthForm>
    </AuthLayout>
  );
};

export default ResetPassword;
