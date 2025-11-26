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
import { AddressFormProps } from '@/components/molecules/address-form/types';

const CheckoutAddressForm = ({
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
  addressType,
}: AddressFormProps & { addressType?: 'shipping' | 'billing' }) => {
  const translate = useTranslations();

  const { showSavedMessage, showFailedMessage } = useEntityToasters('address');

  const router = useRouter();

  const params = useSearchParams();

  const id = params.get('id');

  const defaultAddress = useMemo(() => {
    return (addresses.find((a) => a.id === id) ?? {}) as Partial<Address>;
  }, [addresses, id]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Partial<Address>>({
    defaultValues: defaultAddress,
  });

  const [sameAsBilling, setSameAsBilling] = useState(false);
  const watchCountry = watch('country');
  const selectedCountry = countryOptions.find((c) => c.value === watchCountry);

  const onFormSubmit = async (formData: Partial<Address>) => {
    const success = await (id ? onUpdateAddress?.(formData) : onAddAddress?.(formData as Address, sameAsBilling));

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
        submit: translations.submit ?? translate('checkout.add-and-continue'),
      }}
      showSubmitButton={showSubmitButton}
      showCancelButton={showCancelButton}
      onSubmit={handleSubmit(onFormSubmit)}
      onCancel={onCancel ?? router.back}
      classNames={{ buttonsContainer: 'justify-end' }}
      stackButtonsOnMobile
    >
      <div className="flex flex-col gap-4">
        <Input
          label={translate('common.company-name')}
          required
          {...register('name', {
            required: translate('common.fieldIsRequired'),
          })}
          error={errors.name?.message}
        />

        <Input label={translate('common.care-of')} showOptionalLabel {...register('careOf')} />

        {showPhoneField && (
          <Input
            label={translate('common.phone')}
            optionalLabel={translate('common.optional-for-order-updates')}
            showOptionalLabel
            {...register('phone')}
          />
        )}

        <Controller
          name="country"
          control={control}
          rules={{ required: translate('common.fieldIsRequired') }}
          render={({ field }) => (
            <Select
              {...field}
              label={translate('common.country')}
              required
              placeholder={translate('common.select')}
              options={countryOptions}
              error={errors.country?.message}
              defaultValue=""
            />
          )}
        />

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="md:max-w-[120px]">
            <Input
              label={translate('common.street-number')}
              required
              {...register('streetNumber', {
                required: translate('common.fieldIsRequired'),
              })}
              error={errors.streetNumber?.message}
            />
          </div>

          <div className="grow">
            <Input
              label={translate('common.street-name')}
              required
              {...register('streetName', {
                required: translate('common.fieldIsRequired'),
              })}
              error={errors.streetName?.message}
            />
          </div>
        </div>

        <Input label={translate('common.building-business')} showOptionalLabel {...register('building')} />

        <div className="flex w-full flex-row gap-4">
          <div className="w-full basis-1/2">
            <Input
              label={translate('common.zipCode')}
              required
              containerClassName="w-full basis-1/2 grow"
              {...register('zip', {
                required: translate('common.fieldIsRequired'),
              })}
              error={errors.zip?.message}
            />
          </div>

          <div className="w-full basis-1/2">
            <Input
              label={translate('common.city')}
              required
              {...register('city', {
                required: translate('common.fieldIsRequired'),
              })}
              error={errors.city?.message}
            />
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
                placeholder={translate('common.state')}
                options={selectedCountry.states}
                defaultValue=""
              />
            )}
          />
        )}

        {addressType === 'billing' && (
          <div className="flex items-center gap-5">
            <Controller
              name="isDefaultBilling"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value ?? false}
                  onChecked={field.onChange}
                  label={translate('account.address-setDefault-billing')}
                  containerClassName="items-start"
                />
              )}
            />
          </div>
        )}

        {addressType === 'shipping' && (
          <>
            <div className="flex flex-col gap-5 md:flex-row">
              <Controller
                name="isDefaultShipping"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value ?? false}
                    onChecked={field.onChange}
                    label={translate('checkout.save-as-default-shipping')}
                    name="isDefaultShipping"
                    containerClassName="items-start"
                  />
                )}
              />

              <Checkbox
                checked={sameAsBilling}
                onChecked={() => setSameAsBilling(!sameAsBilling)}
                label={translate('checkout.use-as-billing')}
                name="sameAsBilling"
                containerClassName="items-start"
              />
            </div>
          </>
        )}
      </div>
    </EntityForm>
  );
};

export default CheckoutAddressForm;
