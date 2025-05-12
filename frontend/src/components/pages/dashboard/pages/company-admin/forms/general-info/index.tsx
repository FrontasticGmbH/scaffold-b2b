import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
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

  const { register, handleSubmit } = useForm<Partial<BusinessUnit>>({
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
        <Input
          label={translate('common.name')}
          required
          containerClassName="max-w-[400px]"
          {...register('name', { required: true })}
        />
        <Input
          label={translate('common.email')}
          type="email"
          required
          containerClassName="max-w-[400px]"
          {...register('email', {
            required: true,
          })}
        />
      </div>
    </EntityForm>
  );
};

export default GeneralInfoForm;
