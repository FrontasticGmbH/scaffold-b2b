import React, { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import EntityForm from '@/components/organisms/entity-form';
import { useTranslations } from 'use-intl';
import Input from '@/components/atoms/input';
import Select from '@/components/atoms/select';
import Checkbox from '@/components/atoms/checkbox';
import { useForm, Controller } from 'react-hook-form';
import { Address } from '@/types/entity/address';
import useEntityToasters from '@/hooks/useEntityToasters';
import { AddressFormProps } from './types';

const AddressForm = ({
  onAddAddress,
  onUpdateAddress,
  addresses,
  countryOptions,
  onSave,
  onCancel,
  unstyled = false,
  toasters = true,
  translations = {},
  showPhoneField = true,
  showCancelButton = true,
  showSubmitButton = true,
  showDefaultCheckBoxes = true,
}: AddressFormProps) => {
  const translate = useTranslations();

  const { showSavedMessage, showFailedMessage } = useEntityToasters('address');

  const router = useRouter();

  const params = useSearchParams();

  const id = params.get('id');

  const defaultAddress = useMemo(() => {
    return (addresses.find((a) => a.id === id) ?? {}) as Partial<Address>;
  }, [addresses, id]);

  const { register, control, handleSubmit, watch } = useForm<Partial<Address>>({
    defaultValues: defaultAddress,
  });

  const watchCountry = watch('country');
  const selectedCountry = countryOptions.find((c) => c.value === watchCountry);
  const [showLine2, setShowLine2] = useState(!!defaultAddress.line2);

  const onFormSubmit = async (formData: Partial<Address>) => {
    if (!(formData.name && formData.country && formData.line1 && formData.zip && formData.city)) return;

    const success = await (id ? onUpdateAddress?.(formData) : onAddAddress?.(formData as Address));

    if (toasters) {
      if (success) {
        showSavedMessage();
      } else {
        showFailedMessage();
      }
    }

    (onSave ?? router.back)();
  };

  return (
    <EntityForm
      unstyled={unstyled}
      translations={{
        cancel: translations.cancel ?? translate('common.cancel'),
        submit: translations.submit ?? translate('common.save'),
      }}
      showSubmitButton={showSubmitButton}
      showCancelButton={showCancelButton}
      onSubmit={handleSubmit(onFormSubmit)}
      onCancel={onCancel ?? router.back}
    >
      <div className="flex flex-col gap-4">
        <Input
          label={translate('common.company-name')}
          required
          containerClassName="max-w-[400px]"
          {...register('name')}
        />

        <Input
          label={translate('common.care-of')}
          showOptionalLabel
          containerClassName="max-w-[400px]"
          {...register('careOf')}
        />

        {showPhoneField && (
          <Input
            label={translate('common.phone')}
            showOptionalLabel
            optionalLabel={translate('common.optional-for-order-updates')}
            containerClassName="max-w-[400px]"
            {...register('phone')}
          />
        )}

        <Controller
          name="country"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              {...field}
              label={translate('common.country')}
              required
              className="max-w-[400px]"
              placeholder={translate('common.select')}
              options={countryOptions}
            />
          )}
        />

        <Input label={translate('common.address')} required containerClassName="max-w-[400px]" {...register('line1')} />

        {showLine2 ? (
          <Input
            label={`${translate('common.address')} 2`}
            showOptionalLabel
            containerClassName="max-w-[400px]"
            {...register('line2')}
          />
        ) : (
          <span className="w-fit cursor-pointer text-14 font-medium text-gray-700" onClick={() => setShowLine2(true)}>
            + {translate('dashboard.add-another-address')}
          </span>
        )}

        <div className="flex max-w-[400px] gap-3">
          <Input
            label={translate('common.zipCode')}
            required
            containerClassName="w-[100px] min-w-[100px]"
            {...register('zip')}
          />
          <div className="grow">
            <Input label={translate('common.city')} required {...register('city')} />
          </div>
        </div>

        {!!selectedCountry?.states?.length && (
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label={translate('common.state')}
                required
                className="max-w-[400px]"
                placeholder={translate('common.state')}
                options={selectedCountry.states}
              />
            )}
          />
        )}

        {showDefaultCheckBoxes && (
          <>
            <p className="cursor-pointer text-14 font-medium text-gray-700">{translate('dashboard.save-as-default')}</p>
            <div className="flex items-center gap-5">
              <Controller
                name="isDefaultShipping"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value ?? false}
                    onChecked={field.onChange}
                    label={translate('common.address-shipping')}
                  />
                )}
              />
              <Controller
                name="isDefaultBilling"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value ?? false}
                    onChecked={field.onChange}
                    label={translate('common.address-billing')}
                  />
                )}
              />
            </div>
          </>
        )}
      </div>
    </EntityForm>
  );
};

export default AddressForm;
