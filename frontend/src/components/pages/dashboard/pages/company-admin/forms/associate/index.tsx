import React, { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import EntityForm from '@/components/organisms/entity-form';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Input from '@/components/atoms/input';
import Select from '@/components/atoms/select';
import { Associate } from '@/types/entity/associate';
import { CompanyAdminPageProps } from '../../types';

const AssociateForm = ({ onUpdateAssociate, onAddAssociate, associates, roleOptions }: CompanyAdminPageProps) => {
  const { translate } = useTranslation();

  const router = useRouter();

  const params = useSearchParams();

  const id = params.get('id');

  const defaultValues = (associates.find((associate) => associate.id === id) ?? {}) as Partial<Associate>;

  const [data, setData] = useState<Partial<Associate>>(defaultValues);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setData({ ...data, [e.target.name]: e.target.value });
    },
    [data],
  );

  const handleSubmit = useCallback(async () => {
    await (id ? onUpdateAssociate?.(data) : onAddAssociate?.(data as Associate));

    router.back();
  }, [onAddAssociate, onUpdateAssociate, data, id, router]);

  return (
    <EntityForm
      translations={{ cancel: translate('common.cancel'), submit: translate('common.save') }}
      onSubmit={handleSubmit}
      onCancel={router.back}
    >
      <div className="flex flex-col gap-4">
        <Input
          name="email"
          label={translate('common.email')}
          required
          value={data.email}
          onChange={handleChange}
          containerClassName="max-w-[400px]"
        />
        <Select
          label={translate('common.role')}
          placeholder={translate('common.select')}
          required
          value={data.role}
          className="max-w-[400px]"
          onChange={(role) => setData({ ...data, role })}
          options={roleOptions}
        />
      </div>
    </EntityForm>
  );
};

export default AssociateForm;
