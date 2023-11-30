import React, { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import EntityForm from '@/components/organisms/entity-form';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Input from '@/components/atoms/input';
import { PurchaseList } from '@/types/entity/purchase-list';
import TextArea from '@/components/atoms/text-area';
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
  const { translate } = useTranslation();

  const router = useRouter();

  const params = useSearchParams();

  const id = propId ?? params.get('id');

  const defaultValues = (purchaseLists.find((list) => list.id === id) ?? {}) as Partial<PurchaseList>;

  const [data, setData] = useState<Partial<PurchaseList>>(defaultValues);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setData({ ...data, [e.target.name]: e.target.value });
    },
    [data],
  );

  const handleSubmit = useCallback(async () => {
    await (id ? onUpdatePurchaseList?.(data) : onAddPurchaseList?.(data as PurchaseList));
    (onSave ?? router.back)();
  }, [onUpdatePurchaseList, onAddPurchaseList, data, id, router, onSave]);

  return (
    <EntityForm
      translations={{ cancel: translate('common.cancel'), submit: translate('common.save') }}
      onSubmit={handleSubmit}
      onCancel={onCancel ?? router.back}
      classNames={classNames}
    >
      <div className="flex flex-col gap-4">
        <Input
          name="name"
          label={translate('common.name')}
          required
          value={data.name ?? ''}
          onChange={handleChange}
          containerClassName="md:w-[350px] lg:w-[400px]"
        />
        <TextArea
          name="description"
          label={translate('common.description')}
          showOptionalLabel
          value={data.description}
          onChange={handleChange}
          className="h-[160px] md:w-[350px] lg:w-[400px]"
        />
      </div>
    </EntityForm>
  );
};

export default PurchaseListForm;
