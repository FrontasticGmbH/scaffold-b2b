'use client';

import { ChangeEvent, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import PasswordInput from '@/components/atoms/password-input';
import { useTranslations } from 'use-intl';
import useValidate from '@/hooks/useValidate/useValidate';
import AuthLayout from '../layouts/auth-layout';
import { ResetPasswordData, ResetPasswordProps } from './types';
import AuthForm from '../layouts/auth-form';

const ResetPassword = ({ image, logo, logoLink, resetPassword }: ResetPasswordProps) => {
  const router = useCustomRouter();

  const searchParams = useSearchParams();

  const { validatePassword } = useValidate();

  const translate = useTranslations();

  const [reset, setReset] = useState(false);
  const [data, setData] = useState<ResetPasswordData>({
    password: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState<string>();

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = () => {
    const token = searchParams.get('token');

    if (reset) {
      router.push('/');
    }

    if (token && data.password == data.confirmPassword) {
      const isValidPassword = validatePassword(data.password);

      if (!isValidPassword) {
        setValidationError(translate('error.password-not-valid'));
        return;
      }
      resetPassword(token, data.password).then(() => {
        setReset(true);
      });
    } else {
      setValidationError(translate('dashboard.password-not-match'));
    }
  };

  return (
    <AuthLayout image={image} logo={logo} logoLink={logoLink}>
      <AuthForm
        onSubmit={handleSubmit}
        includeCheckIcon={reset}
        title={
          reset ? translate('account.password-reset-success-headline') : translate('account.password-reset-headline')
        }
        buttonLabel={reset ? translate('account.account-login') : translate('account.password-reset-keyword')}
        footerLinkLabel={reset ? '' : translate('account.account-back-login')}
        footerLink="/login"
      >
        {reset ? (
          <p className="inline text-16 leading-loose text-gray-600">
            {translate('account.password-reset-success-desc')}
          </p>
        ) : (
          <>
            <PasswordInput
              containerClassName="w-full"
              className="w-full"
              name="password"
              label={translate('account.password')}
              value={data.password}
              onChange={handleChange}
              required
            />
            <PasswordInput
              containerClassName="w-full"
              error={validationError}
              className="w-full"
              name="confirmPassword"
              label={translate('account.password-confirm')}
              value={data.confirmPassword}
              onChange={handleChange}
              required
            />
          </>
        )}
      </AuthForm>
    </AuthLayout>
  );
};

export default ResetPassword;
