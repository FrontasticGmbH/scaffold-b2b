import { useMemo } from 'react';
import { CheckoutProps } from '../../types';
import AddressesStep from '../../steps/addresses';
import ShippingStep from '../../steps/shipping';
import PaymentStep from '../../steps/payment';

const useSteps = ({
  addresses,
  onAddAddress,
  onCompleteAddresses,
  onCompleteShipping,
  onCompletePayment,
  initialData = {},
  countryOptions = [],
  shippingMethods = [],
  paymentMethods = [],
  translations,
}: Omit<CheckoutProps, 'transaction' | 'products' | 'discounts' | 'onSubmitPurchase'>) => {
  const steps = useMemo(() => {
    return [
      {
        title: 'common.addresses',
        Component: (
          <AddressesStep
            addresses={addresses}
            onAddAddress={onAddAddress}
            onCompleteAddresses={onCompleteAddresses}
            countryOptions={countryOptions}
            initialData={initialData}
          />
        ),
      },
      {
        title: 'checkout.shipping',
        Component: (
          <ShippingStep
            shippingMethods={shippingMethods}
            onCompleteShipping={onCompleteShipping}
            initialData={initialData}
          />
        ),
      },
      {
        title: 'common.payment',
        Component: (
          <PaymentStep
            paymentMethods={paymentMethods}
            onCompletePayment={onCompletePayment}
            initialData={initialData}
            translations={translations}
          />
        ),
      },
    ];
  }, [
    addresses,
    onAddAddress,
    onCompleteAddresses,
    countryOptions,
    initialData,
    shippingMethods,
    onCompleteShipping,
    paymentMethods,
    onCompletePayment,
  ]);

  return { steps };
};

export default useSteps;
