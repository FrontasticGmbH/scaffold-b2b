'use client';

import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
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
  const translate = useTranslations();
  const { validatePassword } = useValidate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onFormSubmit = async (data: ResetPasswordData) => {
    const token = searchParams.get('token');

    if (!token) {
      setError('password', { type: 'manual', message: translate('error.wentWrong') });
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: translate('dashboard.password-not-match'),
      });
      return;
    }

    const isValidPassword = validatePassword(data.password);
    if (!isValidPassword) {
      setError('password', { type: 'manual', message: translate('error.password-not-valid') });
      return;
    }

    try {
      await resetPassword(token, data.password);
      router.push('/');
    } catch {
      setError('password', { type: 'manual', message: translate('error.wentWrong') });
    }
  };

  return (
    <AuthLayout image={image} logo={logo} logoLink={logoLink}>
      <AuthForm
        onSubmit={handleSubmit(onFormSubmit)}
        title={translate('account.password-reset-headline')}
        buttonLabel={translate('account.password-reset-keyword')}
        footerLinkLabel={translate('account.account-back-login')}
        footerLink="/login"
      >
        <PasswordInput
          containerClassName="w-full"
          className="w-full"
          label={translate('account.password')}
          {...register('password', {
            required: translate('common.fieldIsRequired'),
          })}
          required
          error={errors.password?.message}
        />

        <PasswordInput
          containerClassName="w-full"
          className="w-full"
          label={translate('account.password-confirm')}
          {...register('confirmPassword', {
            required: translate('common.fieldIsRequired'),
          })}
          required
          error={errors.confirmPassword?.message}
        />
      </AuthForm>
    </AuthLayout>
  );
};

export default ResetPassword;
