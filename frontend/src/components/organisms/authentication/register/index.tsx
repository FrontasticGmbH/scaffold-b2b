import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useCustomRouter from '@/hooks/useCustomRouter';
import Input from '@/components/atoms/input';
import PasswordInput from '@/components/atoms/password-input';
import toast from '@/components/atoms/toaster/helpers/toast';
import { Account } from '@shared/types/account/Account';
import { useTranslations } from 'use-intl';
import { namePattern } from '@/constants/regex';
import useValidate from '@/hooks/useValidate/useValidate';
import AuthLayout from '../layouts/auth-layout';
import { RegisterProps } from './types';
import AuthForm from '../layouts/auth-form';
import useAuthProps from './hooks/useAuthProps';

const Register = ({ image, logo, logoLink, register }: RegisterProps) => {
  const translate = useTranslations();

  const router = useCustomRouter();

  const { validatePassword } = useValidate();

  const {
    register: formRegister,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<Account>({
    defaultValues: {},
  });

  const data = watch();
  const [confirmed, setConfirmed] = useState(false);

  const onFormSubmit = async (formData: Account) => {
    const noEmptyFields = formData.email && formData.password && formData.companyName;

    if (noEmptyFields) {
      const isValidPassword = formData.password && validatePassword(formData.password);

      if (!isValidPassword) {
        setError('password', { type: 'manual', message: translate('error.password-not-valid') });
        return;
      }

      try {
        await register(formData);
        setConfirmed(true);
      } catch (err: any) {
        if (err.message.includes('409')) {
          if (err.message.includes('account')) {
            setError('email', { type: 'manual', message: translate('error.email-exists') });
          } else if (err.message.includes('company')) {
            setError('companyName', { type: 'manual', message: translate('error.company-exists') });
          }
        } else {
          toast.error(translate('error.account-create-fail'));
        }
      }
    }
  };

  const handleRedirect = () => {
    router.push('/login');
  };

  const authProps = useAuthProps({
    confirmed,
    handleSubmitRegister: handleSubmit(onFormSubmit),
    handleLoginRedirect: handleRedirect,
  });

  return (
    <AuthLayout image={image} logo={logo} logoLink={logoLink}>
      <AuthForm {...authProps}>
        {confirmed ? (
          <div>
            <p className="inline text-16 leading-loose text-gray-600">{translate('account.verification-sent')}</p>
            <p className="inline text-16 font-medium leading-loose text-gray-600">{` ${data.email}. `}</p>
            <p className="inline text-16 leading-loose text-gray-600">{translate('account.verification-login')}</p>
          </div>
        ) : (
          <>
            <Input
              label={translate('common.emailAddress')}
              value={data.email ?? ''}
              error={errors.email?.message}
              containerClassName="w-full"
              className="w-full"
              {...formRegister('email', {
                required: translate('common.fieldIsRequired'),
              })}
              required
            />

            <Input
              label={translate('common.companyName')}
              value={data.companyName ?? ''}
              error={errors.companyName?.message}
              containerClassName="w-full"
              className="w-full"
              {...formRegister('companyName', {
                required: translate('common.fieldIsRequired'),
              })}
              required
            />

            <Input
              label={translate('common.firstName')}
              value={data.firstName ?? ''}
              error={errors.firstName?.message}
              containerClassName="w-full"
              className="w-full"
              {...formRegister('firstName', {
                required: translate('common.fieldIsRequired'),
                pattern: {
                  value: namePattern,
                  message: translate('common.name-validation'),
                },
              })}
              required
            />

            <Input
              label={translate('common.lastName')}
              value={data.lastName ?? ''}
              error={errors.lastName?.message}
              containerClassName="w-full"
              className="w-full"
              {...formRegister('lastName', {
                required: translate('common.fieldIsRequired'),
                pattern: {
                  value: namePattern,
                  message: translate('common.name-validation'),
                },
              })}
              required
            />

            <PasswordInput
              label={translate('account.password')}
              value={data.password ?? ''}
              error={errors.password?.message}
              containerClassName="w-full"
              className="w-full"
              {...formRegister('password', {
                required: translate('common.fieldIsRequired'),
              })}
              required
            />
          </>
        )}
      </AuthForm>
    </AuthLayout>
  );
};

export default Register;
