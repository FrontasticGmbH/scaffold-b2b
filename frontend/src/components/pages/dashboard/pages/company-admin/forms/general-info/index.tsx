import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import EntityForm from '@/components/organisms/entity-form';
import { useTranslations } from 'use-intl';
import Input from '@/components/atoms/input';
import { BusinessUnit } from '@/types/entity/business-unit';
import useEntityToasters from '@/hooks/useEntityToasters';
import { CompanyAdminPageProps } from '../../types';

const GeneralInfoForm = ({ onUpdateGeneralInfo, generalInformation }: CompanyAdminPageProps) => {
  const translate = useTranslations();

  const { showSavedMessage, showFailedMessage } = useEntityToasters('businessunit');

  const router = useRouter();

  const params = useSearchParams();

  const id = params.get('id');

  const defaultValues = (generalInformation.find((info) => info.id === id) ?? {}) as Partial<BusinessUnit>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<BusinessUnit>>({
    defaultValues,
  });

  const onSubmit = async (formData: Partial<BusinessUnit>) => {
    const success = await onUpdateGeneralInfo?.({
      name: formData.name,
      email: formData.email,
      id: formData.id,
    });

    if (success) showSavedMessage();
    else showFailedMessage();

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
          name="name"
          control={control}
          rules={{
            required: translate('common.fieldIsRequired'),
          }}
          render={({ field }) => (
            <Input
              label={translate('common.name')}
              containerClassName="max-w-[400px]"
              error={errors.name?.message}
              {...field}
            />
          )}
        />

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
              containerClassName="max-w-[400px]"
              error={errors.email?.message}
              required
              {...field}
            />
          )}
        />
      </div>
    </EntityForm>
  );
};

export default GeneralInfoForm;
