import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import Input from '@/components/atoms/input';
import TextArea from '@/components/atoms/text-area';
import { PurchaseList } from '@/types/entity/purchase-list';
import useEntityToasters from '@/hooks/useEntityToasters';
import Select from '@/components/atoms/select';
import useHeaderData from '@/lib/tastics/header/hooks/useHeaderData';
import Link from '@/components/atoms/link';
import { classnames } from '@/utils/classnames/classnames';
import Button from '@/components/atoms/button';
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
  const { businessUnits, onBusinessUnitSelect, selectedBusinessUnit } = useHeaderData();

  const id = propId ?? params.get('id');

  const defaultValues = (purchaseLists?.find((list) => list?.id === id) ?? {}) as Partial<PurchaseList>;

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<Partial<PurchaseList>>({
    defaultValues,
  });

  const onSubmit: SubmitHandler<Partial<PurchaseList>> = async (formData) => {
    const success = await (id
      ? onUpdatePurchaseList?.(formData)
      : onAddPurchaseList?.({
          name: formData.name,
          description: formData.description ?? '',
        } as PurchaseList));

    if (success) showSavedMessage();
    else showFailedMessage();

    (onSave ?? router.back)();
  };

  const isEditing = !!id;

  return (
    <form
      className={classnames('rounded-md border border-neutral-400', classNames?.form)}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className={classnames('flex flex-col gap-4 px-6', { 'max-w-[500px] py-4': !isEditing })}>
        <Controller
          name="name"
          control={control}
          rules={{
            required: translate('common.fieldIsRequired'),
          }}
          render={({ field }) => (
            <Input label={translate('common.name')} error={errors.name?.message} required {...field} />
          )}
        />

        <Select
          label={translate('common.business-unit')}
          placeholder={translate('common.select')}
          options={businessUnits}
          value={selectedBusinessUnit}
          onChange={onBusinessUnitSelect}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextArea label={translate('common.description')} showOptionalLabel className="h-[160px]" {...field} />
          )}
        />
        {isEditing && (
          <Link
            className="block text-sm font-semibold text-blue-700 underline lg:hidden"
            href={`/purchase-lists?subPath=add-purchase-list`}
          >
            {`${translate('dashboard.purchase-create-new-list')} +`}
          </Link>
        )}
      </div>
      <div
        className={classnames('mb-4 flex items-center gap-3 px-6 py-2 pt-8', {
          'mt-6 justify-between border-t border-gray-300': isEditing,
          'justify-start': !isEditing,
        })}
      >
        {isEditing && (
          <Link
            className="hidden text-sm font-semibold text-blue-700 underline lg:block"
            href={`/purchase-lists?subPath=add-purchase-list`}
          >
            {`${translate('dashboard.purchase-create-new-list')} +`}
          </Link>
        )}

        <div
          className={classnames('flex gap-2', {
            'w-full justify-between lg:w-fit lg:justify-start': isEditing,
            'w-full flex-col md:w-fit md:flex-row': !isEditing,
          })}
        >
          <Button
            variant="secondary"
            size="m"
            onClick={onCancel ?? router.back}
            type="button"
            className="min-w-[112px]"
          >
            {translate('common.cancel')}
          </Button>

          <Button variant="primary" size="m" type="submit" loading={isSubmitting} className="min-w-[112px]">
            {isEditing ? translate('common.save') : translate('dashboard.purchase-list-create')}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PurchaseListForm;
