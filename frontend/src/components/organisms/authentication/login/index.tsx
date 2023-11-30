'use client';

import { ChangeEvent, FC, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '@/components/atoms/input';
import PasswordInput from '@/components/atoms/password-input';
import { Account } from '@shared/types/account/Account';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Checkbox from '@/components/atoms/checkbox';
import Link from '@/components/atoms/link';
import toast from '@/components/atoms/toaster/helpers/toast';
import AuthLayout from '../layouts/auth-layout';
import useAuthProps from './hooks/useAuthProps';
import { LoginProps } from './types';
import AuthForm from '../layouts/auth-form';

const Login: FC<LoginProps> = ({ login, requestPasswordReset, ...props }) => {
  const searchParams = useSearchParams();
  const lvp = searchParams.get('lvp');
  const router = useRouter();

  const { translate } = useTranslation();

  const [data, setData] = useState<Account & { rememberMe?: boolean }>({});
  const [resetting, setResetting] = useState(false);

  const goBackToLogin = () => {
    setResetting(false);
  };

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = target;
    setData({ ...data, [name]: value == 'on' ? checked : value });
  };

  const handleLoginSubmit = () => {
    if (data.email && data.password) {
      login(data.email, data.password, data.rememberMe)
        .then(() => {
          const redirectLink = lvp ? `/${lvp}` : '/';
          router.push(redirectLink);
        })
        .catch(() => {
          toast.error(translate('error.auth.wrong'));
        });
    }
  };

  const handleResetSubmit = () => {
    if (data.email) {
      requestPasswordReset(data.email)
        .then(() => {
          setResetting(false);
        })
        .catch(() => {
          toast.error(translate('error.email'));
        });
    } else {
      toast.error(translate('error.email'));
    }
  };

  const { image, logo, logoLink, ...formProps } = useAuthProps({
    ...props,
    handleLoginSubmit,
    handleResetSubmit,
    resetting,
    goBackToLogin,
  });

  return (
    <AuthLayout image={image} logo={logo} logoLink={logoLink}>
      <AuthForm {...formProps}>
        <Input
          containerClassName="w-full"
          className="w-full"
          name="email"
          required
          label={translate('common.emailAddress')}
          value={data.email ?? ''}
          onChange={handleChange}
        />

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
              <Link
                className="text-14 text-gray-600 underline hover:text-gray-500"
                href="#"
                onClick={() => setResetting(true)}
              >
                {translate('account.password.forgot')}
              </Link>
            </div>
          </>
        )}
      </AuthForm>
    </AuthLayout>
  );
};

export default Login;
