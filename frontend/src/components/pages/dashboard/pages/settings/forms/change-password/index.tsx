import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/atoms/button';
import { useTranslations } from 'use-intl';
import PasswordInput from '@/components/atoms/password-input';
// import useValidate from '@/hooks/useValidate/useValidate';
import { Props } from './types';

type FormValues = {
  oldPassword: string;
  newPassword: string;
  confirmedNewPassword: string;
};

const ChangePasswordForm = ({ onCancel, onChangePassword }: Props) => {
  const translate = useTranslations();

  // const { validatePassword } = useValidate();

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmedNewPassword: '',
    },
  });

  const [passwordError, setPasswordError] = useState('');

  const oldPassword = watch('oldPassword');
  const newPassword = watch('newPassword');
  const confirmedNewPassword = watch('confirmedNewPassword');

  useEffect(() => {
    if (passwordError && newPassword) {
      setPasswordError('');
    }
  }, [newPassword, passwordError]);

  const onSubmit = async (data: FormValues) => {
    //TODO: Need to discuss, there are no restrictions on signup
    // const isValidPassword = validatePassword(data.newPassword);
    // if (!isValidPassword) {
    //   setPasswordError(translate('error.password-not-valid'));
    //   return;
    // }

    if (data.newPassword !== data.confirmedNewPassword) {
      setError('confirmedNewPassword', {
        type: 'manual',
        message: translate('dashboard.password-not-match'),
      });
      return;
    }

    await onChangePassword?.(data.oldPassword, data.newPassword);

    setValue('oldPassword', '');
    setValue('newPassword', '');
    setValue('confirmedNewPassword', '');
    reset({
      oldPassword: '',
      newPassword: '',
      confirmedNewPassword: '',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <PasswordInput
          containerClassName="w-[370px]"
          label={translate('dashboard.current-password')}
          required
          value={oldPassword}
          {...register('oldPassword', { required: true })}
        />

        <PasswordInput
          containerClassName="w-[370px]"
          label={translate('dashboard.new-password')}
          required
          value={newPassword}
          error={passwordError}
          {...register('newPassword', { required: true })}
        />

        <PasswordInput
          containerClassName="w-[370px]"
          label={translate('dashboard.confirm-password')}
          required
          value={confirmedNewPassword}
          error={errors.confirmedNewPassword?.message}
          {...register('confirmedNewPassword', { required: true })}
        />
      </div>

      <div className="flex items-center gap-3 pt-6">
        <Button variant="secondary" size="m" onClick={onCancel} type="button" className="min-w-[112px]">
          {translate('common.cancel')}
        </Button>
        <Button
          variant="primary"
          size="m"
          type="submit"
          disabled={!isValid || isSubmitting}
          loading={isSubmitting}
          className="min-w-[112px]"
        >
          {translate('common.save')}
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
