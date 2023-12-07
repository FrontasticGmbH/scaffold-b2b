import React, { useCallback, useState } from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Button from '@/components/atoms/button';
import { useCheckout } from '../../provider';
import { CheckoutProps } from '../../types';

const CompletePurchase = ({ onSubmitPurchase }: Pick<CheckoutProps, 'onSubmitPurchase'>) => {
  const { isLastStep } = useCheckout();

  const { translate } = useTranslation();

  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    setLoading(true);

    await onSubmitPurchase();

    setLoading(false);
  }, [onSubmitPurchase]);

  if (!isLastStep) return <></>;

  return (
    <div className="mt-4">
      <Button variant="primary" size="m" loading={loading} className="w-full lg:hidden" onClick={handleClick}>
        {translate('checkout.complete.purchase')}
      </Button>
    </div>
  );
};

export default CompletePurchase;
