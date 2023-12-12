import React, { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import EntityForm from '@/components/organisms/entity-form';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Input from '@/components/atoms/input';
import Select from '@/components/atoms/select';
import Checkbox from '@/components/atoms/checkbox';
import { Address } from '@/types/entity/address';
import { CompanyAdminPageProps } from '../../types';

const AddressForm = ({ onAddAddress, onUpdateAddress, addresses, countryOptions }: CompanyAdminPageProps) => {
  const { translate } = useTranslation();

  const router = useRouter();

  const params = useSearchParams();

  const id = params.get('id');

  const defaultValues = (addresses.find((address) => address.id === id) ?? {}) as Partial<Address>;

  const [data, setData] = useState<Partial<Address>>(defaultValues);

  const [showLine2, setShowLine2] = useState(false);

  const selectedCountry = countryOptions.find((option) => option.value === data.country);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setData({ ...data, [e.target.name]: e.target.value });
    },
    [data],
  );

  const handleSubmit = useCallback(async () => {
    await (id ? onUpdateAddress?.(data) : onAddAddress?.(data as Address));

    router.back();
  }, [onUpdateAddress, onAddAddress, data, id, router]);

  return (
    <EntityForm
      translations={{ cancel: translate('common.cancel'), submit: translate('common.save') }}
      onSubmit={handleSubmit}
      onCancel={router.back}
    >
      <div className="flex flex-col gap-4">
        <Input
          name="name"
          label={translate('common.company.name')}
          required
          value={data.name}
          onChange={handleChange}
          containerClassName="max-w-[400px]"
        />

        <Input
          name="careOf"
          label={translate('common.care.of')}
          showOptionalLabel
          value={data.careOf}
          onChange={handleChange}
          containerClassName="max-w-[400px]"
        />

        <Select
          label={translate('common.country')}
          required
          className="max-w-[400px]"
          placeholder={translate('common.select')}
          value={data.country}
          onChange={(country) => setData({ ...data, country })}
          options={countryOptions}
        />

        <Input
          name="line1"
          label={translate('common.address')}
          required
          value={data.line1}
          onChange={handleChange}
          containerClassName="max-w-[400px]"
        />

        {showLine2 ? (
          <Input
            name="line2"
            label={`${translate('common.address')} 2`}
            showOptionalLabel
            value={data.line2}
            onChange={handleChange}
            containerClassName="max-w-[400px]"
          />
        ) : (
          <span className="w-fit cursor-pointer text-14 font-medium text-gray-700" onClick={() => setShowLine2(true)}>
            + {translate('dashboard.add.another.address')}
          </span>
        )}

        <div className="flex max-w-[400px] gap-3">
          <Input
            name="zip"
            label={translate('common.zipCode')}
            required
            value={data.zip}
            onChange={handleChange}
            containerClassName="w-[100px] min-w-[100px]"
          />
          <div className="grow">
            <Input name="city" label={translate('common.city')} required value={data.city} onChange={handleChange} />
          </div>
        </div>

        {!!selectedCountry?.states?.length && (
          <Select
            label={translate('common.state')}
            required
            className="max-w-[400px]"
            placeholder={translate('common.state')}
            value={data.state}
            onChange={(state) => setData({ ...data, state })}
            options={selectedCountry.states}
          />
        )}

        <p className="cursor-pointer text-14 font-medium text-gray-700">{translate('dashboard.save.as.default')}</p>

        <div className="flex items-center gap-5">
          <Checkbox
            checked={data.isDefaultShipping}
            label={translate('common.address.shipping')}
            onChecked={(checked) => setData({ ...data, isDefaultShipping: checked })}
          />
          <Checkbox
            checked={data.isDefaultBilling}
            label={translate('common.address.billing')}
            onChecked={(checked) => setData({ ...data, isDefaultBilling: checked })}
          />
        </div>
      </div>
    </EntityForm>
  );
};

export default AddressForm;
