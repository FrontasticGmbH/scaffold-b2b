import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import EntityForm from '@/components/organisms/entity-form';
import { useTranslations } from 'use-intl';
import { Account } from '@/types/entity/account';
import Select from '@/components/atoms/select';
import { SettingsPageProps } from '../../types';

const RestrictedPersonalInfoForm = ({ onUpdateAccount, account, businessUnitOptions, isAdmin }: SettingsPageProps) => {
  const translate = useTranslations();

  const router = useRouter();

  const [data, setData] = useState<Partial<Account>>(account);

  const handleSubmit = useCallback(async () => {
    await onUpdateAccount?.(data);

    router.back();
  }, [onUpdateAccount, data, router]);

  return (
    <EntityForm
      translations={{ cancel: translate('common.cancel'), submit: translate('common.save') }}
      onSubmit={handleSubmit}
      onCancel={router.back}
    >
      <div className="flex flex-col gap-4">
        <Select
          label={translate(
            // eslint-disable-next-line
            // @ts-ignore
            'common.company',
          )}
          required={isAdmin}
          value={data.businessUnit}
          onChange={(businessUnit) => setData({ ...data, businessUnit })}
          className="w-full min-w-[unset] md:w-[350px] lg:w-[400px]"
          options={businessUnitOptions}
          disabled={!isAdmin}
        />
      </div>
    </EntityForm>
  );
};

export default RestrictedPersonalInfoForm;
