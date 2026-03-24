import React from 'react';
import useSteps from '../../hooks/useSteps';
import { useCheckout } from '../../provider';
import Step from '../step';
import { CheckoutProps } from '../../types';

const Steps = ({
  addresses,
  onAddAddress,
  onCompleteAddresses,
  onCompleteShipping,
  onCompletePayment,
  initialData = {},
  countryOptions = [],
  shippingMethods = [],
  paymentMethods = [],
  translations = {},
}: Omit<CheckoutProps, 'transaction' | 'products' | 'discounts' | 'onSubmitPurchase'>) => {
  const { steps } = useSteps({
    addresses,
    onAddAddress,
    onCompleteAddresses,
    countryOptions,
    initialData,
    shippingMethods,
    onCompleteShipping,
    paymentMethods,
    onCompletePayment,
    translations,
  });

  const { activeStep, resetStepTo } = useCheckout();

  return (
    <div className="flex flex-col gap-4 overflow-hidden md:gap-6 lg:grow lg:gap-8">
      {steps.map(({ title, Component }, index) => (
        <Step
          key={index}
          number={index + 1}
          title={title}
          isActive={activeStep === index}
          isCompleted={activeStep > index}
          onNavigate={() => resetStepTo(index)}
        >
          {Component({ isActive: activeStep === index, isCompleted: activeStep > index })}
        </Step>
      ))}
    </div>
  );
};

export default Steps;
