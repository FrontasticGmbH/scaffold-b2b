import React, { useCallback, useEffect, useState } from 'react';
import Radio from '@/components/atoms/radio';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { classnames } from '@/utils/classnames/classnames';
import Button from '@/components/atoms/button';
import toast from 'react-hot-toast';
import Accordion from '@/components/molecules/accordion';
import Image from '@/components/atoms/Image';
import PurchaseOrderForm from '@/components/organisms/checkout/components/purchase-order-form';
import PurchaseOrderPreview from '@/components/organisms/checkout/components/purchase-order-preview';
import { useCheckout } from '../../provider';
import { Props as StepProps } from '../../components/step/types';
import { CheckoutProps } from '../../types';

const PaymentStep = ({
  isCompleted,
  paymentMethods,
  onCompletePayment,
  initialData = {},
  translations,
}: Pick<CheckoutProps, 'paymentMethods' | 'onCompletePayment' | 'initialData' | 'translations'> &
  Pick<StepProps, 'isActive' | 'isCompleted'>) => {
  const { translate } = useTranslation();

  const { nextStep, tempData, setTempData } = useCheckout();

  const [loading, setLoading] = useState(false);

  const [paymentData, setPaymentData] = useState<unknown>({});

  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(paymentMethods[0]?.id);

  useEffect(() => {
    setSelectedPaymentMethodId(initialData.paymentMethodId ?? paymentMethods[0]?.id);
  }, [initialData.paymentMethodId, paymentMethods]);

  const handleStepCompletion = useCallback(async () => {
    setLoading(true);

    const success = await onCompletePayment?.(selectedPaymentMethodId, paymentData);

    if (success) nextStep();
    else toast.error(translate('common.something.went.wrong'), { position: 'top-right' });

    setLoading(false);
  }, [selectedPaymentMethodId, onCompletePayment, nextStep, translate, paymentData]);

  if (isCompleted) {
    const paymentMethod = paymentMethods.find((method) => method.id === selectedPaymentMethodId);

    return (
      <div className="px-4 pb-4 lg:px-0 lg:pb-6">
        <div className="md:rounded-md md:border md:border-neutral-400 md:p-5">
          {paymentMethod?.id === 'purchase.order' && <PurchaseOrderPreview />}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="px-px">
        <div className="grid grid-cols-1 gap-px">
          {paymentMethods.map(({ id, name, description, image }, index, arr) => (
            <div
              key={id}
              className={classnames('flex items-center justify-between p-4 outline outline-1 outline-neutral-400', {
                'rounded-t-md': index === 0,
                'rounded-b-md': index === arr.length - 1,
              })}
              onClick={() => setSelectedPaymentMethodId(id)}
            >
              <Accordion className="border-none" isExpanded={id === selectedPaymentMethodId}>
                <Accordion.Button defaultSpacing={false} withArrow={false}>
                  <div className="flex items-center justify-between md:justify-start md:gap-[64px]">
                    <div className="flex items-center gap-4">
                      <Radio
                        aria-label={translate('checkout.paymentMethod')}
                        checked={id === selectedPaymentMethodId}
                      />
                      <h5 className="text-14 font-medium text-gray-700">{name}</h5>
                    </div>
                    {image.src && (
                      <div className={classnames('relative', image.className)}>
                        <Image src={image.src} style={{ objectFit: 'contain' }} fill alt={name} />
                      </div>
                    )}
                  </div>
                </Accordion.Button>
                <Accordion.Panel defaultSpacing={false}>
                  <div className="pb-1 pt-5">
                    <p className="text-14 leading-loose text-gray-600">{description}</p>
                    <div className="mt-4">
                      {selectedPaymentMethodId === 'purchase.order' && (
                        <PurchaseOrderForm
                          defaultValues={{
                            purchaseOrderNumber: tempData.purchaseOrderNumber,
                            invoiceMemo: tempData.invoiceMemo,
                          }}
                          onChange={(data) => {
                            setPaymentData(data);
                            setTempData(data as Record<string, string>);
                          }}
                        />
                      )}
                    </div>
                  </div>
                </Accordion.Panel>
              </Accordion>
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
        {translations?.review ?? translate('checkout.review.quote')}
      </Button>
    </div>
  );
};

export default PaymentStep;
