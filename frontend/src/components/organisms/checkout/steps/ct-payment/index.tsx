import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import useSession from '@/lib/hooks/useSession';
import useProjectSettings from '@/lib/hooks/useProjectSettings';
import Button from '@/components/atoms/button';
import { useTranslations } from 'use-intl';
import toast from '@/components/atoms/toaster/helpers/toast';
import useAccount from '@/lib/hooks/useAccount';
import useCustomRouter from '@/hooks/useCustomRouter';
import { CheckoutProps } from '../../types';
import { useCheckout } from '../../provider';
import { Props as StepProps } from '../../components/step/types';
import { PaymentMethod } from './types';

const CommercetoolsPayment = ({
  isActive,
  isCompleted,
  translations,
  onCompletePayment,
  callbackUrl,
}: Pick<CheckoutProps, 'translations' | 'onCompletePayment' | 'callbackUrl'> &
  Pick<StepProps, 'isActive' | 'isCompleted'>) => {
  const router = useCustomRouter();

  const initiatedCheckout = useRef(false);

  const errorTriggered = useRef(false);

  const { account, logout } = useAccount();

  const { nextStep, setCheckoutIsProcessing } = useCheckout();

  const [loading, setLoading] = useState(false);

  const { session, isExpired } = useSession();

  const params = useParams();
  const locale = params?.locale;

  const { projectSettings } = useProjectSettings();

  const translate = useTranslations();

  const projectKey = projectSettings?.projectKey;
  const region = projectSettings?.region;

  const handleStepCompletion = useCallback(
    async (paymentMethodId: string) => {
      setLoading(true);

      await onCompletePayment?.(paymentMethodId, {});

      nextStep();

      setLoading(false);
    },
    [onCompletePayment, nextStep],
  );

  useEffect(() => {
    if (initiatedCheckout.current || !projectKey || !region || !session?.token || !isActive) return;

    initiatedCheckout.current = true;

    import('@commercetools/checkout-browser-sdk').then((module) => {
      module.paymentFlow({
        projectKey,
        region,
        sessionId: session.token,
        locale,
        onError(message) {
          switch (message.code) {
            case 'payment_failed':
              setCheckoutIsProcessing(false);

              toast.error(translate('checkout.wentWrong'), { position: 'top-right' });

              break;
          }
        },
        onInfo(message) {
          switch (message.code) {
            case 'payment_method_selection_confirmation':
              const { method } = message.payload as { method: PaymentMethod };

              handleStepCompletion(method.type);

              break;
            case 'payment_validation_started':
              setCheckoutIsProcessing(true);

              break;

            case 'checkout_completed':
              setCheckoutIsProcessing(false);

              const { order } = message.payload as { order: { id: string } };

              window.location.href = `${locale}${callbackUrl}/?orderId=${order.id}`;

              break;
          }
        },
      });
    });
  }, [
    projectKey,
    region,
    session?.token,
    locale,
    handleStepCompletion,
    isActive,
    router,
    setCheckoutIsProcessing,
    translate,
    callbackUrl,
  ]);

  useEffect(() => {
    if (!isActive) initiatedCheckout.current = false;
  }, [isActive]);

  useEffect(() => {
    if (account?.accountId && isExpired && !errorTriggered.current) {
      errorTriggered.current = true;
      logout().then(() => {
        router.push('/login');
        toast.error(translate('checkout.your-token-has-expired'), { position: 'top-right' });
      });
    }
  }, [isExpired, router, logout, translate, account]);

  return (
    <div>
      <div data-ctc />

      {!isCompleted && (
        <div className="mr-3 flex justify-end">
          <Button
            type="submit"
            className="mt-4 w-full md:w-fit"
            size="l"
            variant="primary"
            loading={loading}
            data-ctc-selector="confirmMethod"
          >
            {translations?.review ?? translate('checkout.review-quote')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommercetoolsPayment;
