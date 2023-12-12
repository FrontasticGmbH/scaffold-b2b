import React, { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import EntityForm from '@/components/organisms/entity-form';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Input from '@/components/atoms/input';
import { BusinessUnit } from '@/types/entity/business-unit';
import { CompanyAdminPageProps } from '../../types';

const GeneralInfoForm = ({ onUpdateGeneralInfo, generalInformation }: CompanyAdminPageProps) => {
  const { translate } = useTranslation();

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
    await onUpdateGeneralInfo?.(data);

    router.back();
  }, [onUpdateGeneralInfo, data, router]);

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
          value={data.name}
          onChange={handleChange}
          containerClassName="max-w-[400px]"
        />
        <Input
          name="email"
          label={translate('common.email')}
          required
          type="email"
          value={data.email}
          onChange={handleChange}
          containerClassName="max-w-[400px]"
        />
      </div>
    </EntityForm>
  );
};

export default GeneralInfoForm;
