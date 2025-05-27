import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import EntityForm from '@/components/organisms/entity-form';
import { useTranslations } from 'use-intl';
import Input from '@/components/atoms/input';
import { BusinessUnit } from '@/types/entity/business-unit';
import useEntityToasters from '@/hooks/useEntityToasters';
import { BusinessUnitPayload, CompanyAdminPageProps } from '../../types';

const BusinessUnitForm = ({
  onUpdateBusinessUnit,
  onAddBusinessUnit,
  businessUnits,
  storeName,
}: CompanyAdminPageProps) => {
  const translate = useTranslations();
  const { showSavedMessage, showFailedMessage } = useEntityToasters('businessunit');
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get('id');

  const defaultValues = (businessUnits.find((bu) => bu.id === id) ?? {}) as Partial<BusinessUnitPayload>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<BusinessUnitPayload>>({
    defaultValues,
  });

  const onSubmit = async (formData: Partial<BusinessUnitPayload>) => {
    if (!formData.name || !formData.email) return;

    const success = await (id
      ? onUpdateBusinessUnit?.(formData)
      : onAddBusinessUnit?.({ name: formData.name, email: formData.email } as BusinessUnit));

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
        {!id && (
          <p className="pb-2 text-14 text-gray-700">
            {translate('dashboard.add-business-unit-to')} <span className="font-semibold">{storeName}</span>
          </p>
        )}
        {id && <p>{translate('dashboard.entity-update-how-to-delete')}</p>}

        <Controller
          name="name"
          control={control}
          rules={{ required: translate('common.fieldIsRequired') }}
          render={({ field }) => (
            <Input
              label={translate('common.name')}
              containerClassName="max-w-[400px]"
              error={errors.name?.message}
              required
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

export default BusinessUnitForm;
