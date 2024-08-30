import React, { useCallback, useState } from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Button from '@/components/atoms/button';
import TextArea from '@/components/atoms/text-area';
import { classnames } from '@/utils/classnames/classnames';
import { useCheckout } from '../../provider';
import { CheckoutProps } from '../../types';

const CompletePurchase = ({
  onSubmitPurchase,
  buyerCanAddComment,
  translations = {},
}: Pick<CheckoutProps, 'onSubmitPurchase' | 'translations' | 'buyerCanAddComment'>) => {
  const { isLastStep, isCtCheckoutEnabled, checkoutIsProcessing, setCheckoutIsProcessing } = useCheckout();

  const { translate } = useTranslation();

  const [buyerComment, setBuyerComment] = useState('');

  const handleClick = useCallback(async () => {
    if (isCtCheckoutEnabled) return;

    setCheckoutIsProcessing(true);

    await onSubmitPurchase({ buyerComment });

    setCheckoutIsProcessing(false);
  }, [onSubmitPurchase, buyerComment, isCtCheckoutEnabled, setCheckoutIsProcessing]);

  return (
    <div className={classnames('mt-4 lg:hidden', { hidden: !isLastStep })}>
      {isLastStep && buyerCanAddComment && !isCtCheckoutEnabled && (
        <div>
          <TextArea
            label={translate('common.comment').toUpperCase()}
            className="min-h-[100px]"
            onChange={(e) => setBuyerComment(e.target.value)}
          />
        </div>
      )}
      <div className="mt-5">
        <Button
          variant="primary"
          size="m"
          loading={checkoutIsProcessing}
          className="w-full"
          onClick={handleClick}
          {...(isCtCheckoutEnabled
            ? {
                'data-ctc-selector': 'paymentButton',
              }
            : {})}
        >
          {translations.purchase || translate('checkout.complete.purchase')}
        </Button>

        {isCtCheckoutEnabled && <div className="mt-3" data-ctc-selector="vendorPaymentButton"></div>}
      </div>
    </div>
  );
};

export default CompletePurchase;
