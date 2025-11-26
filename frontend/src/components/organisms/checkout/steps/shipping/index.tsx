import Button from '@/components/atoms/button';
import Radio from '@/components/atoms/radio';
import useFormat from '@/hooks/useFormat';
import { classnames } from '@/utils/classnames/classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslations } from 'use-intl';
import { Props as StepProps } from '../../components/step/types';
import { useCheckout } from '../../provider';
import { CheckoutProps } from '../../types';

const ShippingStep = ({
  isCompleted,
  shippingMethods,
  shippingDiscount,
  onCompleteShipping,
  initialData = {},
  transaction,
}: Pick<CheckoutProps, 'shippingMethods' | 'shippingDiscount' | 'onCompleteShipping' | 'initialData' | 'transaction'> &
  Pick<StepProps, 'isActive' | 'isCompleted'>) => {
  const translate = useTranslations();

  const { nextStep, visitedAllSteps, goToLastStep } = useCheckout();

  const [loading, setLoading] = useState(false);

  const { formatCurrency } = useFormat();

  const [selectedShippingMethodId, setSelectedShippingMethodId] = useState(shippingMethods[0]?.id);

  useEffect(() => {
    setSelectedShippingMethodId(initialData.shippingMethodId ?? shippingMethods[0]?.id);
  }, [initialData.shippingMethodId, shippingMethods]);

  const cartSubtotal = useMemo(() => {
    const { subtotal, discounts } = transaction;
    return (subtotal - discounts) * 100; // Convert to cents
  }, [transaction]);

  // Check if a specific shipping method offers free shipping
  const isMethodFreeShipping = useCallback(
    (freeAbove?: number) => {
      return freeAbove ? cartSubtotal >= freeAbove : false;
    },
    [cartSubtotal],
  );

  const handleStepCompletion = useCallback(async () => {
    setLoading(true);

    const success = await onCompleteShipping?.(selectedShippingMethodId);

    if (success) (visitedAllSteps ? goToLastStep : nextStep)();
    else toast.error(translate('common.something-went-wrong'), { position: 'top-right' });

    setLoading(false);
  }, [selectedShippingMethodId, onCompleteShipping, nextStep, translate, visitedAllSteps, goToLastStep]);

  if (isCompleted) {
    const shippingMethod = shippingMethods.find((method) => method.id === selectedShippingMethodId);
    const { name, description, price, currency, freeAbove } = shippingMethod ?? {};
    const isFree = isMethodFreeShipping(freeAbove);
    const hasDiscount = !!shippingDiscount;

    // Calculate discount for this specific method
    // Note: shippingDiscount prices are in CENTS, but shipping method price is in DOLLARS
    // If originalPrice is 0, we only have discount percentage (before selection), use method price
    const isUsingMethodPrice = shippingDiscount?.originalPrice === 0;
    const methodOriginalPrice = isUsingMethodPrice ? (price ?? 0) : (shippingDiscount?.originalPrice ?? 0);
    const methodDiscountedPrice =
      isUsingMethodPrice && shippingDiscount?.discountPercentage
        ? ((price ?? 0) * (10000 - shippingDiscount.discountPercentage)) / 10000
        : (shippingDiscount?.discountedPrice ?? 0);

    const isFullyDiscounted =
      hasDiscount && (methodDiscountedPrice === 0 || shippingDiscount?.discountPercentage === 10000);

    return (
      <div className="lg:pb-6">
        <div className="rounded-md border border-gray-300 p-3 md:p-5">
          <div className={classnames('flex items-center justify-between')}>
            <div>
              <h6 className="text-sm font-semibold leading-loose text-neutral-800">{name}</h6>
              <p className="text-sm font-normal leading-loose text-gray-600">{description}</p>
            </div>
            {(() => {
              if (isFree || isFullyDiscounted) {
                return (
                  <div className="flex flex-col items-end gap-1 md:flex-row md:items-center md:gap-2">
                    {hasDiscount && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatCurrency(
                          isUsingMethodPrice ? methodOriginalPrice : methodOriginalPrice / 100,
                          currency ?? 'USD',
                        )}
                      </span>
                    )}
                    <span className="text-base font-semibold leading-snug text-green-500">
                      {translate('cart.freeShipping')}
                    </span>
                  </div>
                );
              }

              if (hasDiscount) {
                return (
                  <div className="flex flex-col items-end gap-1 md:flex-row md:items-center md:gap-2">
                    <span className="text-sm text-gray-500 line-through">
                      {formatCurrency(
                        isUsingMethodPrice ? methodOriginalPrice : methodOriginalPrice / 100,
                        currency ?? 'USD',
                      )}
                    </span>
                    <span className="text-base font-semibold leading-snug text-green-500">
                      {formatCurrency(
                        isUsingMethodPrice ? methodDiscountedPrice : methodDiscountedPrice / 100,
                        currency ?? 'USD',
                      )}
                    </span>
                  </div>
                );
              }

              return (
                <span className="text-base font-semibold leading-snug text-neutral-800">
                  {formatCurrency(price ?? 0, currency ?? 'USD')}
                </span>
              );
            })()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="px-px">
        <div className="grid grid-cols-1 gap-px">
          {shippingMethods.map(({ id, name, price, currency, description, freeAbove }, index, arr) => {
            const isFree = isMethodFreeShipping(freeAbove);
            const hasDiscount = !!shippingDiscount;

            // Calculate discount for this specific method
            // Note: shippingDiscount prices are in CENTS, but shipping method price is in DOLLARS
            // If originalPrice is 0, we only have discount percentage (before selection), use method price
            const isUsingMethodPrice = shippingDiscount?.originalPrice === 0;
            const methodOriginalPrice = isUsingMethodPrice ? price : (shippingDiscount?.originalPrice ?? 0);
            const methodDiscountedPrice =
              isUsingMethodPrice && shippingDiscount?.discountPercentage
                ? (price * (10000 - shippingDiscount.discountPercentage)) / 10000
                : (shippingDiscount?.discountedPrice ?? 0);

            const isFullyDiscounted =
              hasDiscount && (methodDiscountedPrice === 0 || shippingDiscount?.discountPercentage === 10000);

            return (
              <div
                key={id}
                className={classnames('flex items-center justify-between border p-3', {
                  'rounded-t-md': index === 0,
                  'rounded-b-md': index === arr.length - 1,
                  'border-gray-300': id !== selectedShippingMethodId,
                  'border-2 border-accent-blue': id === selectedShippingMethodId,
                })}
              >
                <div className="flex items-center gap-4" onClick={() => setSelectedShippingMethodId(id)}>
                  <Radio checked={id === selectedShippingMethodId} />
                  <div>
                    <h6 className="text-sm font-semibold leading-loose text-neutral-800">{name}</h6>
                    <p className="text-sm font-normal leading-loose text-gray-600">{description}</p>
                  </div>
                </div>
                {(() => {
                  if (isFree || isFullyDiscounted) {
                    return (
                      <div className="flex flex-col items-end gap-1 md:flex-row md:items-center md:gap-2">
                        {hasDiscount && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatCurrency(
                              isUsingMethodPrice ? methodOriginalPrice : methodOriginalPrice / 100,
                              currency,
                            )}
                          </span>
                        )}
                        <span className="text-base font-semibold leading-snug text-green-500">
                          {translate('cart.freeShipping')}
                        </span>
                      </div>
                    );
                  }

                  if (hasDiscount) {
                    return (
                      <div className="flex flex-col items-end gap-1 md:flex-row md:items-center md:gap-2">
                        <span className="text-sm text-gray-500 line-through">
                          {formatCurrency(
                            isUsingMethodPrice ? methodOriginalPrice : methodOriginalPrice / 100,
                            currency,
                          )}
                        </span>
                        <span className="text-base font-semibold leading-snug text-green-500">
                          {formatCurrency(
                            isUsingMethodPrice ? methodDiscountedPrice : methodDiscountedPrice / 100,
                            currency,
                          )}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <span className="text-base font-semibold leading-snug text-neutral-800">
                      {formatCurrency(price, currency)}
                    </span>
                  );
                })()}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          className="mt-6 w-full md:w-fit"
          size="l"
          variant="primary"
          loading={loading}
          onClick={handleStepCompletion}
        >
          {translate(visitedAllSteps ? 'checkout.save-and-review' : 'checkout.continue-to-payment')}
        </Button>
      </div>
    </div>
  );
};

export default ShippingStep;
