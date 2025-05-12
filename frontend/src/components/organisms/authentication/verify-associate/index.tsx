import { useForm } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import toast from '@/components/atoms/toaster/helpers/toast';
import useCustomRouter from '@/hooks/useCustomRouter';
import PasswordInput from '@/components/atoms/password-input';
import Input from '@/components/atoms/input';
import useValidate from '@/hooks/useValidate/useValidate';
import AuthForm from '../layouts/auth-form';
import AuthLayout from '../layouts/auth-layout';
import { VerifyAssociateInput, VerifyAssociateProps } from './types';

const VerifyAssociate = ({ image, logo, logoLink, company, onSubmit }: VerifyAssociateProps) => {
  const translate = useTranslations();
  const router = useCustomRouter();

  const { validatePassword } = useValidate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<VerifyAssociateInput>({
    defaultValues: {
      firstName: '',
      lastName: '',
      password: '',
    },
  });

  const onFormSubmit = async (data: VerifyAssociateInput) => {
    const isValidPassword = validatePassword(data.password);
    if (!isValidPassword) {
      setError('password', { type: 'manual', message: translate('error.password-not-valid') });
      return;
    }

    try {
      await onSubmit(data);
      router.refresh();
    } catch {
      toast.error(translate('error.wentWrong'));
    }
  };

  return (
    <AuthLayout image={image} logo={logo} logoLink={logoLink}>
      <AuthForm
        title={translate('account.account-join-title', { company })}
        subtitle={translate('account.account-join-subtitle', { company })}
        buttonLabel={translate('account.account-register')}
        footerLabel={translate('account.by-registering')}
        footerLink="/"
        footerLinkLabel={translate('account.terms-of-use')}
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <Input
          label={translate('common.firstName')}
          containerClassName="w-full"
          className="w-full"
          required
          {...register('firstName')}
          error={errors.firstName?.message}
        />

        <Input
          label={translate('common.lastName')}
          containerClassName="w-full"
          className="w-full"
          required
          {...register('lastName')}
          error={errors.lastName?.message}
        />

        <PasswordInput
          label={translate('account.password')}
          containerClassName="w-full"
          className="w-full"
          required
          {...register('password')}
          error={errors.password?.message}
        />
      </AuthForm>
    </AuthLayout>
  );
};

export default VerifyAssociate;
