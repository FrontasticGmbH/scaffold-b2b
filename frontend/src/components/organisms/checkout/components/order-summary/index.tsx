import React, { useCallback, useState } from 'react';
import Accordion from '@/components/molecules/accordion';
import useFormat from '@/hooks/useFormat';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Image from '@/components/atoms/Image';
import Costs from '@/components/molecules/costs';
import DiscountsForm from '@/components/molecules/discounts-form';
import Button from '@/components/atoms/button';
import useMediaQuery from '@/hooks/useMediaQuery';
import { desktop } from '@/constants/screensizes';
import TextArea from '@/components/atoms/text-area';
import { CheckoutProps } from '../../types';
import { useCheckout } from '../../provider';

const OrderSummary = ({
  transaction,
  products,
  discounts,
  onApplyDiscount,
  onSubmitPurchase,
  buyerCanAddComment,
  translations = {},
}: Pick<
  CheckoutProps,
  | 'transaction'
  | 'products'
  | 'discounts'
  | 'onApplyDiscount'
  | 'onSubmitPurchase'
  | 'translations'
  | 'buyerCanAddComment'
>) => {
  const { translate } = useTranslation();

  const [isLargerThanDesktop] = useMediaQuery(desktop);

  const { isLastStep, isCtCheckoutEnabled, checkoutIsProcessing, setCheckoutIsProcessing } = useCheckout();

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

  return (
    <div className="shrink-0 rounded-lg bg-white lg:w-[432px] lg:p-9">
      <div className="border-b border-neutral-400 pb-4">
        <h5 className="text-gray-700 md:text-18">
          {translations.orderSummaryTitle || translate('checkout.order.summary')}
        </h5>
      </div>
      <Accordion className="border-none" defaultIsExpanded={isLargerThanDesktop}>
        <Accordion.Button defaultSpacing={false} className="py-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">
              {translations.orderSummarySubtitle || translate('checkout.yourOrder')}
            </span>
            <span className="font-medium text-gray-700">{formatCurrency(transaction.total, transaction.currency)}</span>
          </div>
        </Accordion.Button>
        <Accordion.Panel defaultSpacing={false}>
          <div className="lg:hidden">
            <div className="flex flex-col">
              {products.map(({ id, name, price, currency, quantity, images }) => (
                <div key={id} className="flex items-center gap-4 border-t border-neutral-400 py-4 md:gap-8">
                  <div className="relative h-[104px] w-[89px] shrink-0">
                    <Image src={images?.[0]} fill style={{ objectFit: 'contain' }} alt={name} />
                  </div>
                  <div className="flex grow items-center justify-between overflow-hidden">
                    <div className="max-w-full grow">
                      <p className="truncate text-12 text-gray-700 md:text-14">{name}</p>
                      <p className="mt-2 text-12 font-medium text-gray-700 md:hidden">
                        {formatCurrency(price, currency)}
                      </p>
                      <span className="mt-3 block text-14 text-gray-600 md:mt-2">x {quantity}</span>
                    </div>
                    <span className="hidden text-gray-700 md:block">{formatCurrency(price, currency)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-400 pb-6 pt-4">
              <Costs
                subtotal={transaction.subtotal}
                discount={transaction.discounts}
                shipping={transaction.shipping.amount}
                isShippingEstimated={transaction.shipping.isEstimated}
                tax={transaction.taxes}
                total={transaction.total}
                currency={transaction.currency}
                classNames={{ totalAmount: 'border-none pt-[0px]' }}
              />
            </div>
          </div>
          <div className="hidden pb-6 pt-2 lg:block">
            <div className="flex items-center gap-4">
              {products.slice(0, 3).map(({ id, images, name }) => (
                <div className="relative size-[88px]" key={id}>
                  <Image src={images?.[0]} fill style={{ objectFit: 'contain' }} alt={name} />
                </div>
              ))}
              {products.length > 3 && <div className="pl-1 text-14 text-gray-600">+{products.length - 3}</div>}
            </div>
          </div>
        </Accordion.Panel>
      </Accordion>
      <div className="border-b border-neutral-400">
        <DiscountsForm discounts={discounts} onSubmit={onApplyDiscount} />
      </div>
      <div className="hidden pb-5 pt-6 lg:block">
        <Costs
          subtotal={transaction.subtotal}
          discount={transaction.discounts}
          shipping={transaction.shipping.amount}
          isShippingEstimated={transaction.shipping.isEstimated}
          tax={transaction.taxes}
          total={transaction.total}
          currency={transaction.currency}
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

        <div className="mt-5">
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
            {translations.purchase || translate('checkout.complete.purchase')}
          </Button>

          {isCtCheckoutEnabled && <div className="mt-3" data-ctc-selector="vendorPaymentButton"></div>}
        </div>
      </form>
    </div>
  );
};

export default OrderSummary;
