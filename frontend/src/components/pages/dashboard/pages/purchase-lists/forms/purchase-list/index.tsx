import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import EntityForm from '@/components/organisms/entity-form';
import { useTranslations } from 'use-intl';
import Input from '@/components/atoms/input';
import TextArea from '@/components/atoms/text-area';
import { PurchaseList } from '@/types/entity/purchase-list';
import useEntityToasters from '@/hooks/useEntityToasters';
import { Props } from './types';

const PurchaseListForm = ({
  id: propId,
  onAddPurchaseList,
  onUpdatePurchaseList,
  purchaseLists,
  classNames,
  onCancel,
  onSave,
}: Props) => {
  const translate = useTranslations();

  const router = useRouter();

  const params = useSearchParams();

  const { showSavedMessage, showFailedMessage } = useEntityToasters('purchaselist');

  const id = propId ?? params.get('id');

  const defaultValues = (purchaseLists.find((list) => list.id === id) ?? {}) as Partial<PurchaseList>;

  const { register, handleSubmit } = useForm<Partial<PurchaseList>>({
    defaultValues,
  });

  const onSubmit = async (formData: Partial<PurchaseList>) => {
    const success = await (id
      ? onUpdatePurchaseList?.(formData)
      : onAddPurchaseList?.({ name: formData.name, description: formData.description ?? '' } as PurchaseList));

    if (success) showSavedMessage();
    else showFailedMessage();

    (onSave ?? router.back)();
  };

  return (
    <EntityForm
      translations={{
        cancel: translate('common.cancel'),
        submit: translate('common.save'),
      }}
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onCancel ?? router.back}
      classNames={classNames}
    >
      <div className="flex flex-col gap-4">
        <Input
          label={translate('common.name')}
          required
          containerClassName="md:w-[350px] lg:w-[400px]"
          {...register('name', { required: true })}
        />

        <TextArea
          label={translate('common.description')}
          showOptionalLabel
          className="h-[160px] md:w-[350px] lg:w-[400px]"
          {...register('description')}
        />
      </div>
    </EntityForm>
  );
};

export default PurchaseListForm;
