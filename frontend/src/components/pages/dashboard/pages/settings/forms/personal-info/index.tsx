import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import EntityForm from '@/components/organisms/entity-form';
import { useTranslations } from 'use-intl';
import Input from '@/components/atoms/input';
import { Account } from '@/types/entity/account';
import { SettingsPageProps } from '../../types';

const PersonalInfoForm = ({ onUpdateAccount, account }: SettingsPageProps) => {
  const translate = useTranslations();

  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<Account>>({
    defaultValues: account,
  });

  const onSubmit = async (formData: Partial<Account>) => {
    await onUpdateAccount?.(formData);
    router.back();
  };

  return (
    <EntityForm
      translations={{ cancel: translate('common.cancel'), submit: translate('common.save') }}
      onSubmit={handleSubmit(onSubmit)}
      onCancel={router.back}
    >
      <div className="flex flex-col gap-4">
        <Controller
          name="email"
          control={control}
          rules={{
            required: translate('common.fieldIsRequired'),
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: translate('error.email'),
            },
          }}
          render={({ field }) => (
            <Input
              label={translate('common.email')}
              type="email"
              containerClassName="w-full min-w-[unset] md:w-[350px] lg:w-[400px]"
              error={errors.email?.message}
              required
              {...field}
            />
          )}
        />

        <Controller
          name="firstName"
          control={control}
          rules={{ required: translate('common.fieldIsRequired') }}
          render={({ field }) => (
            <Input
              label={translate('common.firstName')}
              containerClassName="w-full min-w-[unset] md:w-[350px] lg:w-[400px]"
              error={errors.firstName?.message}
              requiredStyle="asterisk"
              {...field}
            />
          )}
        />

        <Controller
          name="lastName"
          control={control}
          rules={{ required: translate('common.fieldIsRequired') }}
          render={({ field }) => (
            <Input
              label={translate('common.lastName')}
              containerClassName="w-full min-w-[unset] md:w-[350px] lg:w-[400px]"
              error={errors.lastName?.message}
              requiredStyle="asterisk"
              {...field}
            />
          )}
        />
      </div>
    </EntityForm>
  );
};

export default PersonalInfoForm;
