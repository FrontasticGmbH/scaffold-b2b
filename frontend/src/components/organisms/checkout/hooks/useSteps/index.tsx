import { useMemo } from 'react';
import { CheckoutProps } from '../../types';
import AddressesStep from '../../steps/addresses';
import ShippingStep from '../../steps/shipping';
import PaymentStep from '../../steps/payment';
import { useCheckout } from '../../provider';
import { Props as StepProps } from '../../components/step/types';
import CommercetoolsPayment from '../../steps/ct-payment';

const useSteps = ({
  addresses,
  onAddAddress,
  onCompleteAddresses,
  onCompleteShipping,
  onCompletePayment,
  initialData = {},
  countryOptions = [],
  shippingMethods = [],
  shippingDiscount,
  paymentMethods = [],
  translations,
  callbackUrl,
  transaction,
}: Omit<CheckoutProps, 'products' | 'discounts' | 'onSubmitPurchase'>) => {
  const { isCtCheckoutEnabled } = useCheckout();

  const steps = useMemo(() => {
    return [
      {
        title: 'common.addresses',
        Component: ({ isActive, isCompleted }: Pick<StepProps, 'isActive' | 'isCompleted'>) => (
          <AddressesStep
            isActive={isActive}
            isCompleted={isCompleted}
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
        Component: ({ isActive, isCompleted }: Pick<StepProps, 'isActive' | 'isCompleted'>) => (
          <ShippingStep
            isActive={isActive}
            isCompleted={isCompleted}
            shippingMethods={shippingMethods}
            shippingDiscount={shippingDiscount}
            onCompleteShipping={onCompleteShipping}
            initialData={initialData}
            transaction={transaction}
          />
        ),
      },
      {
        title: 'common.payment',
        Component: ({ isActive, isCompleted }: Pick<StepProps, 'isActive' | 'isCompleted'>) =>
          isCtCheckoutEnabled ? (
            <CommercetoolsPayment
              translations={translations}
              isActive={isActive}
              isCompleted={isCompleted}
              callbackUrl={callbackUrl}
            />
          ) : (
            <PaymentStep
              isActive={isActive}
              isCompleted={isCompleted}
              paymentMethods={paymentMethods}
              onCompletePayment={onCompletePayment}
              initialData={initialData}
              translations={translations}
            />
          ),
      },
    ];
  }, [
    translations,
    isCtCheckoutEnabled,
    addresses,
    onAddAddress,
    onCompleteAddresses,
    countryOptions,
    initialData,
    shippingMethods,
    shippingDiscount,
    onCompleteShipping,
    paymentMethods,
    onCompletePayment,
    callbackUrl,
    transaction,
  ]);

  return { steps };
};

export default useSteps;
