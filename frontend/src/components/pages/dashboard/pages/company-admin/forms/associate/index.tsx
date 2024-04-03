import React, { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import EntityForm from '@/components/organisms/entity-form';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Input from '@/components/atoms/input';
import { Associate } from '@/types/entity/associate';
import useEntityToasters from '@/hooks/useEntityToasters';
import RefinementDropdown from '@/components/atoms/refinement-dropdown';
import Label from '@/components/atoms/label';
import { CompanyAdminPageProps } from '../../types';

const AssociateForm = ({ onUpdateAssociate, onAddAssociate, associates, roleOptions }: CompanyAdminPageProps) => {
  const { translate } = useTranslation();

  const { showSavedMessage, showFailedMessage } = useEntityToasters('associate');

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

  const handleRoleChange = useCallback(
    (role: string) => {
      let updatedRoles = [...(data.roles ?? [])];

      if (updatedRoles.includes(role)) updatedRoles = updatedRoles.filter((r) => r !== role);
      else updatedRoles = [...updatedRoles, role];

      setData({ ...data, roles: updatedRoles });
    },
    [data],
  );

  const handleSubmit = useCallback(async () => {
    const success = await (id ? onUpdateAssociate?.(data) : onAddAssociate?.(data as Associate));

    if (success) showSavedMessage();
    else showFailedMessage();

    router.back();
  }, [onAddAssociate, onUpdateAssociate, data, id, router, showSavedMessage, showFailedMessage]);

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
          value={data.email ?? ''}
          onChange={handleChange}
          containerClassName="max-w-[400px]"
        />

        <div className="max-w-[400px]">
          <Label required>{translate('common.role')}</Label>
          <RefinementDropdown
            options={roleOptions.map((role) => ({ ...role, selected: (data.roles ?? []).includes(role.value) }))}
            onChange={handleRoleChange}
          >
            {(data.roles ?? []).join(', ')}
          </RefinementDropdown>
        </div>
      </div>
    </EntityForm>
  );
};

export default AssociateForm;
