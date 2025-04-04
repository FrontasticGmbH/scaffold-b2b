'use client';

import { ChangeEvent, FC, useState } from 'react';
import Input from '@/components/atoms/input';
import PasswordInput from '@/components/atoms/password-input';
import { Account } from '@shared/types/account/Account';
import { useTranslations } from 'use-intl';
import Checkbox from '@/components/atoms/checkbox';
import Link from '@/components/atoms/link';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSwrClearCache from '@/hooks/useSwrClearCache';
import AuthLayout from '../layouts/auth-layout';
import useAuthProps from './hooks/useAuthProps';
import { LoginProps } from './types';
import AuthForm from '../layouts/auth-form';

const Login: FC<LoginProps> = ({ login, requestPasswordReset, ...props }) => {
  const router = useCustomRouter();

  const clearCache = useSwrClearCache();

  const translate = useTranslations();

  const [data, setData] = useState<Account & { rememberMe?: boolean }>({});
  const [resetting, setResetting] = useState(false);
  const [requested, setRequested] = useState(false);
  const [error, setError] = useState<string>();
  const [inputError, setInputError] = useState<string>();

  const goBackToLogin = () => {
    setRequested(false);
    setResetting(false);
  };

  const gotToReset = () => {
    setResetting(true);
    setError(undefined);
  };

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (error) setError(undefined);

    const { name, value, checked } = target;
    setData({ ...data, [name]: value == 'on' ? checked : value });
  };

  const handleLoginSubmit = async () => {
    if (data.email && data.password) {
      login(data.email, data.password, data.rememberMe)
        .then(() => {
          router.push('/');
          router.refresh();
          clearCache();
        })
        .catch((err: Error) => {
          if (err.message.includes('unverified')) {
            setInputError(translate('error.auth-action-verify'));
          } else {
            setError(translate('error.auth-wrong'));
          }
        });
    } else {
      setError(translate('error.auth-wrong'));
    }
  };

  const handleResetSubmit = () => {
    if (data.email) {
      requestPasswordReset(data.email)
        .then(() => {
          setRequested(true);
        })
        .catch(() => {
          setError(translate('error.email-not-found'));
        });
    }
  };

  const { image, logo, logoLink, ...formProps } = useAuthProps({
    ...props,
    handleLoginSubmit,
    handleResetSubmit,
    resetting,
    requested,
    goBackToLogin,
  });

  return (
    <AuthLayout image={image} logo={logo} logoLink={logoLink}>
      <AuthForm {...formProps} error={error} includeCheckIcon={requested}>
        {requested ? (
          <p className="inline text-16 leading-loose text-gray-600">{translate('account.password-req-sent-desc')}</p>
        ) : (
          <Input
            containerClassName="w-full"
            className="w-full"
            name="email"
            required
            label={translate('common.emailAddress')}
            value={data.email ?? ''}
            onChange={handleChange}
            error={inputError}
          />
        )}

        {!resetting && (
          <>
            <PasswordInput
              containerClassName="w-full"
              className="w-full"
              name="password"
              required
              label={translate('account.password')}
              value={data.password ?? ''}
              onChange={handleChange}
            />
            <div className="mt-6 flex justify-between">
              <Checkbox
                className="text-14 text-gray-500"
                name="rememberMe"
                label={translate('account.rememberMe')}
                onChange={handleChange}
              />
              <Link className="text-14 text-gray-600 underline hover:text-gray-500" href="#" onClick={gotToReset}>
                {translate('account.password-forgot')}
              </Link>
            </div>
          </>
        )}
      </AuthForm>
    </AuthLayout>
  );
};

export default Login;
