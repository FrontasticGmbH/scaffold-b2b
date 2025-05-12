import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import EntityForm from '@/components/organisms/entity-form';
import { useTranslations } from 'use-intl';
import Input from '@/components/atoms/input';
import { Account } from '@/types/entity/account';
import { SettingsPageProps } from '../../types';

const PersonalInfoForm = ({ onUpdateAccount, account }: SettingsPageProps) => {
  const translate = useTranslations();

  const router = useRouter();

  const { register, handleSubmit } = useForm<Partial<Account>>({
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
        <Input
          label={translate('common.email')}
          required
          type="email"
          containerClassName="w-full min-w-[unset] md:w-[350px] lg:w-[400px]"
          {...register('email')}
        />

        <Input
          label={translate('common.firstName')}
          required
          containerClassName="w-full min-w-[unset] md:w-[350px] lg:w-[400px]"
          {...register('firstName')}
        />

        <Input
          label={translate('common.lastName')}
          required
          containerClassName="w-full min-w-[unset] md:w-[350px] lg:w-[400px]"
          {...register('lastName')}
        />
      </div>
    </EntityForm>
  );
};

export default PersonalInfoForm;
