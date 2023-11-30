'use client';

import { ChangeEvent, FC, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PasswordInput from '@/components/atoms/password-input';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import AuthLayout from '../layouts/auth-layout';
import { ResetPasswordData, ResetPasswordProps } from './types';
import AuthForm from '../layouts/auth-form';

const ResetPassword: FC<ResetPasswordProps> = ({ image, logo, logoLink, resetPassword }) => {
  const searchParams = useSearchParams();

  const { translate } = useTranslation();

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
      resetPassword(token, data.password);
    }
  };

  return (
    <AuthLayout image={image} logo={logo} logoLink={logoLink}>
      <AuthForm
        onSubmit={handleSubmit}
        title={translate('account.password.reset.headline')}
        buttonLabel={translate('account.password.reset.keyword')}
        footerLinkLabel={translate('account.account.back.login')}
        footerLink="/login"
      >
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
      </AuthForm>
    </AuthLayout>
  );
};

export default ResetPassword;
