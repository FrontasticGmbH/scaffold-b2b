import React, { useCallback, useState } from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Button from '@/components/atoms/button';
import TextArea from '@/components/atoms/text-area';
import { useCheckout } from '../../provider';
import { CheckoutProps } from '../../types';

const CompletePurchase = ({
  onSubmitPurchase,
  buyerCanAddComment,
  translations = {},
}: Pick<CheckoutProps, 'onSubmitPurchase' | 'translations' | 'buyerCanAddComment'>) => {
  const { isLastStep } = useCheckout();

  const { translate } = useTranslation();

  const [loading, setLoading] = useState(false);

  const [buyerComment, setBuyerComment] = useState('');

  const handleClick = useCallback(async () => {
    setLoading(true);

    await onSubmitPurchase({ buyerComment });

    setLoading(false);
  }, [onSubmitPurchase, buyerComment]);

  if (!isLastStep) return <></>;

  return (
    <div className="mt-4 lg:hidden">
      {isLastStep && buyerCanAddComment && (
        <div>
          <TextArea
            label={translate('common.comment').toUpperCase()}
            className="min-h-[100px]"
            onChange={(e) => setBuyerComment(e.target.value)}
          />
        </div>
      )}
      <div className="mt-5">
        <Button variant="primary" size="m" loading={loading} className="w-full" onClick={handleClick}>
          {translations.purchase || translate('checkout.complete.purchase')}
        </Button>
      </div>
    </div>
  );
};

export default CompletePurchase;
