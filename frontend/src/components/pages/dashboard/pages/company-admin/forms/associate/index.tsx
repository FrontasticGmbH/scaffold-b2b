import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import EntityForm from '@/components/organisms/entity-form';
import { useTranslations } from 'use-intl';
import Input from '@/components/atoms/input';
import { Associate } from '@/types/entity/associate';
import useEntityToasters from '@/hooks/useEntityToasters';
import MultiSelect from '@/components/atoms/multi-select';
import { CompanyAdminPageProps } from '../../types';

const AssociateForm = ({ onUpdateAssociate, onAddAssociate, associates, roleOptions }: CompanyAdminPageProps) => {
  const translate = useTranslations();

  const { showSavedMessage, showFailedMessage } = useEntityToasters('associate');

  const router = useRouter();

  const params = useSearchParams();

  const id = params.get('id');

  const defaultValues = (associates.find((associate) => associate.id === id) ?? {}) as Partial<Associate>;

  const { register, control, handleSubmit } = useForm<Partial<Associate>>({
    defaultValues,
  });

  const onSubmit = async (formData: Partial<Associate>) => {
    if (!formData.email) return;

    const success = await (id
      ? onUpdateAssociate?.(formData)
      : onAddAssociate?.({ email: formData.email, roles: formData.roles ?? [] } as Associate));

    if (success) showSavedMessage();
    else showFailedMessage();

    router.back();
  };

  return (
    <EntityForm
      translations={{
        cancel: translate('common.cancel'),
        submit: translate('common.save'),
      }}
      onSubmit={handleSubmit(onSubmit)}
      onCancel={router.back}
    >
      <div className="flex flex-col gap-4">
        <Input
          label={translate('common.email')}
          required
          containerClassName="max-w-[400px]"
          {...register('email', { required: true })}
        />

        <div className="max-w-[400px]">
          <Controller
            name="roles"
            control={control}
            render={({ field }) => (
              <MultiSelect value={field.value ?? []} options={roleOptions} onChange={field.onChange} />
            )}
          />
        </div>
      </div>
    </EntityForm>
  );
};

export default AssociateForm;
