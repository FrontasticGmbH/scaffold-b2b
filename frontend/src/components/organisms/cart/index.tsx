'use client';

import React, { useEffect, useState } from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import useCloseFlyouts from '@/hooks/useCloseFlyouts';
import Typography from '@/components/atoms/typography';
import Image from '@/components/atoms/Image';
import { classnames } from '@/utils/classnames/classnames';
import InfoBanner from '@/components/molecules/info-banner';
import { Product } from '@/types/entity/product';
import OrderSummary from '../order-summary';
import CartContent from './components/cart-content';
import { CartProps } from './types';
import CheckoutCTA from '../order-summary/components/checkout-cta';
import { CheckoutCTAProps } from '../order-summary/types';

const Cart = ({
  loading,
  paymentMethods,
  transaction,
  lineItems: lineItemsProp,
  onClear,
  viewCartDisabled = false,
  quoteRequestDisabled = false,
  checkoutDisabled = false,
  invalidAddressesRequirements = false,
  discountCodes,
  onDiscountRedeem,
  ...props
}: CartProps) => {
  const { translate } = useTranslation();

  const [lineItems, setLineItems] = useState<Array<Product & { deleted?: boolean }> | undefined>(lineItemsProp);

  useEffect(() => {
    if (!lineItemsProp) return;

    //Maintain the deleted items
    setLineItems((lineItems) => {
      if (!lineItems) return lineItemsProp;

      const newItems = lineItemsProp.filter((lineItem) => !lineItems.find((item) => lineItem.sku === item.sku));

      return [
        ...lineItems.map((lineItem) => {
          const item = lineItemsProp.find((item) => lineItem.sku === item.sku);

          return { ...(item ?? lineItem), deleted: !item };
        }),
        ...newItems,
      ];
    });
  }, [lineItemsProp]);

  const closeFlyouts = useCloseFlyouts();

  const defaultCheckoutCTAProps: CheckoutCTAProps = {
    text: translate('cart.checkout.go'),
    link: '/checkout',
    quoteCheckoutLink: '/quote-checkout',
    onCheckout: closeFlyouts,
    onRequestQuote: closeFlyouts,
    onClear,
    checkoutDisabled,
    quoteRequestDisabled,
    disabled: (lineItems ?? []).filter((item) => !item.deleted).some((item) => !item.inStock),
  };

  if (viewCartDisabled) {
    return (
      <div className="relative p-4 md:bg-neutral-200 md:px-5 md:py-6 lg:p-12">
        <div className="grid w-full place-items-center gap-12 rounded-lg bg-white py-9 pb-[80px]">
          <div className="grid place-items-center gap-6">
            <Typography className="text-center text-16 text-gray-700 md:text-18 lg:text-20">
              {translate('cart.view.disabled')}
            </Typography>

            <Image src="/images/locked-cart.png" className="w-[200px] md:w-[256px] lg:w-[328px]" alt="Cart locked" />
          </div>

          <Typography lineHeight="loose" className="max-w-[720px] text-center text-14 text-gray-600 md:text-16">
            {translate('cart.view.disabled.desc')}
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-neutral-200">
      {!invalidAddressesRequirements && (quoteRequestDisabled || checkoutDisabled) && (
        <div className="px-4 pt-3 md:px-8 lg:px-11">
          <InfoBanner>
            <b>{translate('common.view.only')}</b> {translate('cart.checkout.request.disabled')}
          </InfoBanner>
        </div>
      )}

      {invalidAddressesRequirements && (
        <div className="px-4 pt-3 md:px-8 lg:px-11">
          <InfoBanner>
            <b>{translate('cart.checkout.unavailable')}</b>: {translate('cart.invalid.addresses.requirements')}
          </InfoBanner>
        </div>
      )}

      <div className="flex flex-col bg-white py-4 md:py-6 lg:flex-row lg:items-start lg:gap-6 lg:bg-transparent lg:p-12">
        <CartContent
          loading={loading}
          lineItems={lineItems ?? []}
          className="grow bg-white px-4 py-3 md:px-6 lg:rounded-lg lg:p-9"
          {...props}
        />

        {(lineItems ?? []).length > 0 ? (
          <>
            <OrderSummary
              className="bg-white px-4 pb-3 md:px-6 md:pt-3 lg:mt-0 lg:rounded-lg lg:p-9 lg:px-12 lg:pb-11 xl:w-[432px] xl:shrink-0"
              title="Order Summary"
              paymentMethods={paymentMethods}
              button={
                <CheckoutCTA
                  className={classnames('hidden w-full md:grid', {
                    'mt-4 md:mt-6 lg:pt-11': !quoteRequestDisabled || !checkoutDisabled,
                  })}
                  {...defaultCheckoutCTAProps}
                />
              }
              transaction={transaction}
              discounts={discountCodes}
              onDiscountRedeem={onDiscountRedeem}
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
