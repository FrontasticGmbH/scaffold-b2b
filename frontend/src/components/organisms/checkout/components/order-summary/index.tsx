import React, { useCallback, useState } from 'react';
import Accordion from '@/components/molecules/accordion';
import useFormat from '@/hooks/useFormat';
import { useTranslations } from 'use-intl';
import Costs from '@/components/molecules/costs';
import DiscountsForm from '@/components/molecules/discounts-form';
import Button from '@/components/atoms/button';
import useMediaQuery from '@/hooks/useMediaQuery';
import { desktop } from '@/constants/screensizes';
import TextArea from '@/components/atoms/text-area';
import useDisclosure from '@/hooks/useDisclosure';
import { classnames } from '@/utils/classnames/classnames';
import { CheckoutProps } from '../../types';
import { useCheckout } from '../../provider';
import CheckoutItem from '../checkout-item';
import CheckoutGiftItem from '../checkout-gift-item';

const OrderSummary = ({
  transaction,
  products,
  discounts,
  onApplyDiscount,
  onSubmitPurchase,
  buyerCanAddComment,
  includeTotalAmountInSummary = true,
  translations = {},
  codeApplied,
}: Pick<
  CheckoutProps,
  | 'transaction'
  | 'products'
  | 'discounts'
  | 'onApplyDiscount'
  | 'onSubmitPurchase'
  | 'translations'
  | 'buyerCanAddComment'
  | 'includeTotalAmountInSummary'
  | 'codeApplied'
>) => {
  const translate = useTranslations();
  const cartLevelDiscounts = transaction?.discountSegments.filter((segment) => segment.targetsTotal);
  const [isLargerThanDesktop] = useMediaQuery(desktop);

  const { isLastStep, isCtCheckoutEnabled, checkoutIsProcessing, setCheckoutIsProcessing } = useCheckout();

  const { isOpen: isDiscountExpanded, onOpen: onDiscountExpand, onClose: onDiscountCollapse } = useDisclosure();

  const [buyerComment, setBuyerComment] = useState('');

  const { formatCurrency } = useFormat();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      setCheckoutIsProcessing(true);

      await onSubmitPurchase({ buyerComment });

      setCheckoutIsProcessing(false);
    },
    [onSubmitPurchase, buyerComment, setCheckoutIsProcessing],
  );

  const paidItems = products.filter((product) => !product.isGift);
  const giftItems = products.filter((product) => product.isGift);

  return (
    <div className="shrink-0 rounded-lg bg-white p-5 md:p-9 lg:w-[432px]">
      <div className="pb-2">
        <h5 className="justify-center text-lg font-semibold leading-normal text-neutral-800">
          {translations.orderSummaryTitle || translate('checkout.order-summary')}
        </h5>
      </div>
      <Accordion
        className={classnames('rounded-none border-x-0 border-t-0', 'border-b-0 border-gray-300 md:border-b')}
        defaultIsExpanded={isLargerThanDesktop}
      >
        <Accordion.Button defaultSpacing={false} className="py-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">
              {translations.orderSummarySubtitle || translate('checkout.yourOrder')}
            </span>
            {includeTotalAmountInSummary && (
              <span className="font-medium text-gray-700">
                {formatCurrency(transaction.total, transaction.currency)}
              </span>
            )}
          </div>
        </Accordion.Button>
        <Accordion.Panel defaultSpacing={false}>
          <div className="flex flex-col lg:max-h-[350px] lg:overflow-auto lg:px-2 lg:pb-2">
            {paidItems.map((product) => (
              <CheckoutItem key={product.id} product={product} />
            ))}
            {giftItems.length > 0 && (
              <div className="mt-4 flex w-full flex-col items-stretch gap-4">
                {giftItems.map((product) => (
                  <CheckoutGiftItem key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </Accordion.Panel>
      </Accordion>
      <div className={classnames({ 'border-b border-gray-300': !isDiscountExpanded })}>
        <DiscountsForm
          discounts={discounts}
          onSubmit={onApplyDiscount}
          onExpanded={onDiscountExpand}
          onCollapsed={onDiscountCollapse}
          codeApplied={codeApplied}
        />
      </div>

      <div className={classnames(isDiscountExpanded ? 'pt-1' : 'pt-4')}>
        <Costs
          subtotal={transaction.subtotal}
          discount={transaction.discounts}
          discountSegments={transaction.discountSegments}
          shipping={transaction.shipping.amount}
          isShippingEstimated={transaction.shipping.isEstimated}
          shippingIncludesTaxes={transaction.shipping.shippingIncludesTaxes}
          tax={transaction.taxes}
          total={transaction.total}
          currency={transaction.currency}
          classNames={{ container: 'pt-0' }}
        />
      </div>

      <form onSubmit={handleSubmit} className="hidden lg:block">
        {isLastStep && buyerCanAddComment && (
          <div>
            <TextArea
              label={translate('common.comment').toUpperCase()}
              className="min-h-[100px]"
              onChange={(e) => setBuyerComment(e.target.value)}
            />
          </div>
        )}

        <Button
          variant="primary"
          size="full"
          disabled={!isLastStep}
          loading={checkoutIsProcessing}
          type={isCtCheckoutEnabled ? 'button' : 'submit'}
          {...(isCtCheckoutEnabled
            ? {
                'data-ctc-selector': 'paymentButton',
              }
            : {})}
        >
          {translations.purchase || translate('checkout.complete-purchase')}
        </Button>

        {isCtCheckoutEnabled && <div data-ctc-selector="vendorPaymentButton"></div>}
      </form>
    </div>
  );
};

export default OrderSummary;
