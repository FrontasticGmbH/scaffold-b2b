import React, { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

  const [data, setData] = useState<Partial<BusinessUnit>>(defaultValues);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setData({ ...data, [e.target.name]: e.target.value });
    },
    [data],
  );

  const handleSubmit = useCallback(async () => {
    const success = await onUpdateGeneralInfo?.(data);

    if (success) showSavedMessage();
    else showFailedMessage();

    router.back();
  }, [onUpdateGeneralInfo, data, router, showSavedMessage, showFailedMessage]);

  return (
    <EntityForm
      translations={{ cancel: translate('common.cancel'), submit: translate('common.save') }}
      onSubmit={handleSubmit}
      onCancel={router.back}
    >
      <div className="flex flex-col gap-4">
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
          type="email"
          value={data.email ?? ''}
          onChange={handleChange}
          containerClassName="max-w-[400px]"
        />
      </div>
    </EntityForm>
  );
};

export default GeneralInfoForm;
