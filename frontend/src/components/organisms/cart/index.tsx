'use client';

import React, { useEffect, useMemo, useState } from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import useCloseFlyouts from '@/hooks/useCloseFlyouts';
import { Quote } from '@/types/entity/quote';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import Typography from '@/components/atoms/typography';
import Image from '@/components/atoms/Image';
import Link from '@/components/atoms/link';
import Button from '@/components/atoms/button';
import { LineItem } from '@shared/types/cart';
import OrderSummary from '../order-summary';
import CartContent from './components/cart-content';
import { CartProps } from './types';
import CheckoutCTA from '../order-summary/components/checkout-cta';
import { CheckoutCTAProps } from '../order-summary/types';

const Cart = ({
  paymentMethods,
  transaction,
  onRequestQuote,
  account,
  lineItems: lineItemsProp,
  ...props
}: CartProps) => {
  const [submittedQuote, setSubmittedQuote] = useState<Partial<Quote>>();

  const { translate } = useTranslation();

  const [lineItems, setLineItems] = useState<Array<LineItem & { deleted?: boolean }>>(lineItemsProp ?? []);

  useEffect(() => {
    if (!lineItemsProp) return;

    //Maintain the deleted items
    setLineItems((lineItems) => {
      if (!lineItems) return lineItemsProp;

      return lineItems.map((lineItem) => {
        const item = lineItemsProp.find((item) => lineItem.variant?.sku === item.variant?.sku);

        return { ...(item ?? lineItem), deleted: !item };
      });
    });
  }, [lineItemsProp]);

  const closeFlyouts = useCloseFlyouts();

  const defaultCheckoutCTAProps: CheckoutCTAProps = useMemo(() => {
    return {
      text: translate('cart.checkout.go'),
      link: '/checkout',
      onCheckout: closeFlyouts,
      onRequestQuote: async ({ buyerComment }) => {
        closeFlyouts();
        const quote = await onRequestQuote({ buyerComment });
        setSubmittedQuote(quote);
      },
      disabled: (lineItems ?? []).filter((item) => !item.deleted).some((item) => !item.variant?.isOnStock),
    };
  }, [closeFlyouts, translate, onRequestQuote, lineItems]);

  if (submittedQuote && submittedQuote.id) {
    return (
      <div className="relative min-h-[70vh] bg-neutral-200 p-4 md:px-5 md:py-6 lg:py-12 xl:px-12">
        <div className="grid w-full place-items-center gap-12 rounded-lg bg-white py-9">
          <div className="grid place-items-center gap-6">
            <Typography fontSize={20} className="text-gray-700">
              {translate('cart.quote.submitted')}
            </Typography>

            <Image src="/images/quote-submitted.jpeg" width={144} height={144} alt="Quote submitted" />
          </div>

          <Typography fontSize={16} lineHeight="loose" className="max-w-[720px] text-center text-gray-600">
            {translate('cart.quote.submitted.desc', { values: { email: account.email } })}
          </Typography>

          <Link href={DashboardLinks.quoteRequestDetail(submittedQuote.id)} underlineOnHover={false}>
            <Button size="l">{translate('cart.view.quote')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-neutral-200">
      <div className="flex flex-col bg-white py-4 md:py-6 lg:flex-row lg:items-start lg:gap-6 lg:bg-transparent lg:px-5 lg:py-12 xl:px-12">
        <CartContent
          lineItems={lineItems}
          className="grow bg-white px-4 py-3 md:px-6 lg:rounded-md lg:px-5 lg:py-9 xl:px-12"
          {...props}
        />

        {(lineItems ?? []).length > 0 ? (
          <>
            <OrderSummary
              className="bg-white px-4 pb-3 md:px-6 md:pt-3 lg:mt-0 lg:w-[30%] lg:rounded-md lg:p-9 lg:pb-11 xl:px-12"
              title="Order Summary"
              paymentMethods={paymentMethods}
              button={<CheckoutCTA className="hidden w-full md:grid" {...defaultCheckoutCTAProps} />}
              transaction={transaction}
            />
            <CheckoutCTA
              className="sticky bottom-0 grid w-full border-t border-neutral-400 bg-white p-4 md:hidden"
              {...defaultCheckoutCTAProps}
            />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Cart;
