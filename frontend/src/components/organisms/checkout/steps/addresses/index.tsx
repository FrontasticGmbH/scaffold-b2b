import React, { useCallback, useEffect, useRef, useState } from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Select from '@/components/atoms/select';
import useFormat from '@/hooks/useFormat';
import { classnames } from '@/utils/classnames/classnames';
import Button from '@/components/atoms/button';
import AddressForm from '@/components/molecules/address-form';
import Checkbox from '@/components/atoms/checkbox';
import { Address } from '@/types/entity/address';
import useDisclosure from '@/hooks/useDisclosure';
import Confirmation from '@/components/organisms/confirmation';
import { CheckoutProps } from '../../types';
import { useCheckout } from '../../provider';

const AddressesStep = ({
  addresses,
  onAddAddress,
  onCompleteAddresses,
  countryOptions = [],
  initialData = {},
}: Pick<CheckoutProps, 'addresses' | 'onAddAddress' | 'onCompleteAddresses' | 'countryOptions' | 'initialData'>) => {
  const { activeStep, nextStep, visitedAllSteps, goToLastStep } = useCheckout();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(false);

  const isCompleted = activeStep > 0;

  const { translate } = useTranslation();

  const { formatAddress } = useFormat();

  const [selectedAddresses, setSelectedAddresses] = useState({
    shipping: initialData.shippingAddress ?? addresses[0],
    billing: initialData.billingAddress ?? addresses[0],
  });

  const addressSetRef = useRef({ shipping: false, billing: false });

  useEffect(() => {
    const data = {} as typeof selectedAddresses;

    if (!addressSetRef.current.shipping && initialData.shippingAddress) {
      data.shipping = initialData.shippingAddress;
      addressSetRef.current.shipping = true;
    }
    if (!addressSetRef.current.billing && initialData.billingAddress) {
      data.billing = initialData.billingAddress;
      addressSetRef.current.billing = true;
    }

    setSelectedAddresses((currentSelectedAddresses) => ({ ...currentSelectedAddresses, ...data }));
  }, [initialData.shippingAddress, initialData.billingAddress]);

  const keyToTitle = { shipping: 'delivery', billing: 'billing' };

  const [addingNewAddress, setAddingNewAddress] = useState<'shipping' | 'billing' | ''>('');
  const {
    isOpen: isAddressUnsavedModalOpen,
    onOpen: onAddressUnsavedModalOpen,
    onClose: onAddressUnsavedModalClose,
  } = useDisclosure();

  const [newUnsavedBillingAddress, setNewUnsavedBillingAddress] = useState(false);
  const [sameUnsavedBillingAddress, setSameUnsavedBillingAddress] = useState(false);

  const handleStepCompletion = useCallback(
    async (shippingAddress: Address, billingAddress: Address) => {
      setLoading(true);

      const success = await onCompleteAddresses?.(shippingAddress, billingAddress);

      if (success) (visitedAllSteps ? goToLastStep : nextStep)();

      setLoading(false);
      setError(!success);
    },
    [onCompleteAddresses, nextStep, visitedAllSteps, goToLastStep],
  );

  // Step is done
  if (isCompleted) {
    const preview = [
      { key: 'shipping', address: selectedAddresses.shipping },
      { key: 'billing', address: selectedAddresses.billing },
    ];

    return (
      <div className="px-4 pb-4 lg:px-0 lg:pb-6">
        <div className="flex flex-col gap-4 md:flex-row md:rounded-md md:border md:border-neutral-400 md:p-5">
          {preview.map(({ key, address }) => (
            <div key={key} className="flex flex-col gap-[6px] overflow-hidden md:flex-1">
              <h5 className="text-14 font-medium uppercase text-gray-700">
                {translate(`common.address.${keyToTitle[key as keyof typeof keyToTitle]}`)}
              </h5>
              {address && (
                <>
                  {formatAddress(address as Address)
                    .split('\n')
                    .map((line) => (
                      <p key={line} className="truncate text-14 text-gray-600">
                        {line}
                      </p>
                    ))}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // New address flow
  if (addingNewAddress) {
    return (
      <div>
        <h5 className="pb-4 text-14 font-medium uppercase text-gray-700">
          {translate(`common.address.${keyToTitle[addingNewAddress]}`)}
        </h5>

        <AddressForm
          addresses={[]}
          countryOptions={countryOptions}
          onAddAddress={async (address) => {
            const success = await onAddAddress?.(address);

            if (success) {
              setSelectedAddresses({
                shipping: addingNewAddress === 'shipping' ? address : selectedAddresses.shipping,
                billing: addingNewAddress === 'billing' ? address : selectedAddresses.billing,
              });
            }

            return !!success;
          }}
          onCancel={onAddressUnsavedModalOpen}
          onSave={() => setAddingNewAddress('')}
          showDefaultCheckBoxes={false}
          unstyled
        />
        <Confirmation
          isOpen={isAddressUnsavedModalOpen}
          translations={{
            title: translate('checkout.unsaved.changes'),
            summary: translate('checkout.unsaved.address.changes.confirmation'),
            confirm: translate('common.discard'),
            cancel: translate('common.cancel'),
          }}
          onCancel={onAddressUnsavedModalClose}
          onConfirm={async () => {
            setAddingNewAddress('');
            onAddressUnsavedModalClose();
          }}
        />
      </div>
    );
  }

  // Unsaved addresses flow
  if (addresses.length === 0) {
    return (
      <div>
        <div>
          <h5 className="pb-4 text-14 font-medium uppercase text-gray-700">
            {translate('common.address.delivery')} (1/2)
          </h5>
          <AddressForm
            addresses={[]}
            countryOptions={countryOptions}
            onAddAddress={async (address) => {
              setNewUnsavedBillingAddress(true);
              setSelectedAddresses({ ...selectedAddresses, shipping: address });
              return true;
            }}
            onCancel={() => {}}
            onSave={() => {}}
            showDefaultCheckBoxes={false}
            showSubmitButton={!newUnsavedBillingAddress}
            showCancelButton={false}
            translations={{ submit: translate('checkout.continue.to.billing.address') }}
            unstyled
            toasters={false}
          />
        </div>
        {newUnsavedBillingAddress && (
          <div className="mt-8">
            <h5 className="pb-6 text-14 font-medium uppercase text-gray-700">
              {translate('common.address.billing')} (2/2)
            </h5>

            <div className="pb-6">
              <Checkbox
                label={translate('checkout.billingDetailsLabel')}
                onChecked={(checked) => setSameUnsavedBillingAddress(checked)}
              />
              {sameUnsavedBillingAddress && (
                <Button
                  className="mt-9 w-full md:w-fit"
                  size="l"
                  variant="primary"
                  loading={loading}
                  onClick={async () => {
                    const shipping = await onAddAddress?.(selectedAddresses.shipping);

                    if (!shipping) return false;

                    setSelectedAddresses({ ...selectedAddresses, billing: selectedAddresses.shipping });

                    await handleStepCompletion(selectedAddresses.shipping, selectedAddresses.shipping);

                    return true;
                  }}
                >
                  {translate(visitedAllSteps ? 'checkout.save.and.review' : 'checkout.continue.to.shipping')}
                </Button>
              )}
            </div>

            {!sameUnsavedBillingAddress && (
              <AddressForm
                addresses={[]}
                countryOptions={countryOptions}
                onAddAddress={async (address) => {
                  const shipping = await onAddAddress?.(selectedAddresses.shipping);
                  const billing = await onAddAddress?.(address);

                  if (!shipping || !billing) return false;

                  setSelectedAddresses({ ...selectedAddresses, billing: address });

                  await handleStepCompletion(selectedAddresses.shipping, address);

                  return true;
                }}
                onCancel={() => {}}
                onSave={() => {}}
                showDefaultCheckBoxes={false}
                showPhoneField={false}
                showCancelButton={false}
                translations={{
                  submit: translate(visitedAllSteps ? 'checkout.save.and.review' : 'checkout.continue.to.shipping'),
                }}
                unstyled
                toasters={false}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  // Default select addresses flow
  return (
    <div>
      {[
        {
          key: 'shipping',
          className: '',
          extra: () => (
            <>{error && <p className="pt-5 text-12 text-red-500">{translate('checkout.tax.rates.undefined')}</p>}</>
          ),
        },
        { key: 'billing', className: 'mt-9 lg:mt-11' },
      ].map(({ key, className, extra }) => (
        <div className={classnames('flex flex-col gap-6', className)} key={key}>
          <div>
            <div className="flex items-center justify-between">
              <h5 className="text-14 font-medium uppercase text-gray-700">
                {translate(`common.address.${keyToTitle[key as keyof typeof keyToTitle]}`)}
              </h5>
              <p
                className="hidden cursor-pointer text-14 text-gray-600 underline underline-offset-2 lg:block"
                onClick={() => setAddingNewAddress(key as typeof addingNewAddress)}
              >
                {translate(`checkout.address.${keyToTitle[key as keyof typeof keyToTitle]}.add`)} +
              </p>
            </div>
            <h6 className="mt-4 text-14 text-gray-700"></h6>
            <Select
              className="mt-2"
              value={
                selectedAddresses[key as keyof typeof selectedAddresses]
                  ? formatAddress(selectedAddresses[key as keyof typeof selectedAddresses])
                  : ''
              }
              options={addresses.map((address) => ({
                name: formatAddress(address)
                  .split('\n')
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .join(', '),
                value: formatAddress(address),
              }))}
              onChange={(value) =>
                setSelectedAddresses({
                  ...selectedAddresses,
                  [key]: addresses.find((address) => formatAddress(address) === value),
                })
              }
            />
            {extra?.()}
          </div>
          <p
            className="cursor-pointer text-14 text-gray-600 underline underline-offset-2 lg:hidden"
            onClick={() => setAddingNewAddress(key as typeof addingNewAddress)}
          >
            {translate(`checkout.address.${keyToTitle[key as keyof typeof keyToTitle]}.add`)}+
          </p>
        </div>
      ))}

      <Button
        className="mt-9 w-full md:w-fit"
        size="l"
        variant="primary"
        loading={loading}
        onClick={() => handleStepCompletion(selectedAddresses.shipping, selectedAddresses.billing)}
      >
        {translate(visitedAllSteps ? 'checkout.save.and.review' : 'checkout.continue.to.shipping')}
      </Button>
    </div>
  );
};

export default AddressesStep;
