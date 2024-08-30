import React, { useCallback, useEffect, useState } from 'react';
import useFormat from '@/hooks/useFormat';
import Radio from '@/components/atoms/radio';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { classnames } from '@/utils/classnames/classnames';
import Button from '@/components/atoms/button';
import toast from 'react-hot-toast';
import { useCheckout } from '../../provider';
import { Props as StepProps } from '../../components/step/types';
import { CheckoutProps } from '../../types';

const ShippingStep = ({
  isCompleted,
  shippingMethods,
  onCompleteShipping,
  initialData = {},
}: Pick<CheckoutProps, 'shippingMethods' | 'onCompleteShipping' | 'initialData'> &
  Pick<StepProps, 'isActive' | 'isCompleted'>) => {
  const { translate } = useTranslation();

  const { nextStep, visitedAllSteps, goToLastStep } = useCheckout();

  const [loading, setLoading] = useState(false);

  const { formatCurrency } = useFormat();

  const [selectedShippingMethodId, setSelectedShippingMethodId] = useState(shippingMethods[0]?.id);

  useEffect(() => {
    setSelectedShippingMethodId(initialData.shippingMethodId ?? shippingMethods[0]?.id);
  }, [initialData.shippingMethodId, shippingMethods]);

  const handleStepCompletion = useCallback(async () => {
    setLoading(true);

    const success = await onCompleteShipping?.(selectedShippingMethodId);

    if (success) (visitedAllSteps ? goToLastStep : nextStep)();
    else toast.error(translate('common.something.went.wrong'), { position: 'top-right' });

    setLoading(false);
  }, [selectedShippingMethodId, onCompleteShipping, nextStep, translate, visitedAllSteps, goToLastStep]);

  if (isCompleted) {
    const shippingMethod = shippingMethods.find((method) => method.id === selectedShippingMethodId);

    const { name, estimatedDeliveryDate, price, currency } = shippingMethod ?? {};

    return (
      <div className="px-4 pb-4 lg:px-0 lg:pb-6">
        <div className="md:rounded-md md:border md:border-neutral-400 md:p-5">
          <div className={classnames('flex items-center justify-between')}>
            <div>
              <h6 className="text-14 font-medium leading-loose text-gray-700">{name}</h6>
              <p className="text-14 leading-loose text-gray-600">
                {translate('common.estimated')}: {estimatedDeliveryDate}
              </p>
            </div>
            <span className="text-14 font-medium leading-loose text-gray-700">
              {formatCurrency(price ?? 0, currency ?? 'USD')}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="px-px">
        <div className="grid grid-cols-1 gap-px">
          {shippingMethods.map(({ id, name, price, currency, estimatedDeliveryDate }, index, arr) => (
            <div
              key={id}
              className={classnames('flex items-center justify-between p-4 outline outline-1 outline-neutral-400', {
                'rounded-t-md': index === 0,
                'rounded-b-md': index === arr.length - 1,
              })}
            >
              <div className="flex items-center gap-4" onClick={() => setSelectedShippingMethodId(id)}>
                <Radio checked={id === selectedShippingMethodId} />
                <div>
                  <h6 className="text-14 font-medium leading-loose text-gray-700">{name}</h6>
                  <p className="text-14 leading-loose text-gray-600">
                    <span className="md:hidden">{translate('common.estimated')}</span>
                    <span className="hidden md:inline">{translate('common.estimated.delivery')}</span>:{' '}
                    {estimatedDeliveryDate}
                  </p>
                </div>
              </div>
              <span className="text-14 font-medium leading-loose text-gray-700">{formatCurrency(price, currency)}</span>
            </div>
          ))}
        </div>
      </div>
      <Button
        className="mt-9 w-full md:w-fit"
        size="l"
        variant="primary"
        loading={loading}
        onClick={handleStepCompletion}
      >
        {translate(visitedAllSteps ? 'checkout.save.and.review' : 'checkout.continue.to.payment')}
      </Button>
    </div>
  );
};

export default ShippingStep;
