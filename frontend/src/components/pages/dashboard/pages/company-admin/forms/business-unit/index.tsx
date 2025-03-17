import React, { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import EntityForm from '@/components/organisms/entity-form';
import { useTranslations } from 'use-intl';
import Input from '@/components/atoms/input';
import { BusinessUnit } from '@/types/entity/business-unit';
import useEntityToasters from '@/hooks/useEntityToasters';
import Typography from '@/components/atoms/typography';
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

  const defaultValues = (businessUnits.find((associate) => associate.id === id) ?? {}) as Partial<BusinessUnit>;

  const [data, setData] = useState<Partial<BusinessUnitPayload>>(defaultValues);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setData({ ...data, [e.target.name]: e.target.value });
    },
    [data],
  );

  const handleSubmit = useCallback(async () => {
    const success = await (id ? onUpdateBusinessUnit?.(data) : onAddBusinessUnit?.(data as BusinessUnitPayload));

    if (success) showSavedMessage();
    else showFailedMessage();

    router.back();
  }, [onAddBusinessUnit, onUpdateBusinessUnit, data, id, router, showSavedMessage, showFailedMessage]);

  return (
    <EntityForm
      translations={{ cancel: translate('common.cancel'), submit: translate('common.save') }}
      onSubmit={handleSubmit}
      onCancel={router.back}
    >
      <div className="flex flex-col gap-4">
        {!id && (
          <p className="pb-2 text-14 text-gray-700">
            {translate('dashboard.add-business-unit-to')} <span className="font-semibold">{storeName}</span>
          </p>
        )}
        {id && <Typography>{translate('dashboard.entity-update-how-to-delete')}</Typography>}
        <Input
          name="name"
          label={translate('common.name')}
          required
          value={data.name ?? ''}
          onChange={handleChange}
          containerClassName="max-w-[400px]"
        />
        <Input
          name="email"
          label={translate('common.email')}
          required
          value={data.email ?? ''}
          onChange={handleChange}
          containerClassName="max-w-[400px]"
        />
        {/* <Checkbox
          label={translate('dashboard.business-unit-create-specific-store')}
          onChecked={(checked) => setData({ ...data, createStore: checked })}
        /> */}
      </div>
    </EntityForm>
  );
};

export default BusinessUnitForm;
