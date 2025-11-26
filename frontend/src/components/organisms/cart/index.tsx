'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'use-intl';
import useCloseFlyouts from '@/hooks/useCloseFlyouts';
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
  onAdd,
  codeApplied,
  ...props
}: CartProps) => {
  const translate = useTranslations();

  const [lineItems, setLineItems] = useState<
    Array<Product & { deleted?: boolean; undoProcessing?: boolean }> | undefined
  >(lineItemsProp);

  const allItemsAreDeleted = !lineItems?.filter((item) => !item.deleted).length;

  const containsOutOfStockItem = lineItemsProp?.some((item) => !item.inStock);

  useEffect(() => {
    if (!lineItemsProp) return;

    //Maintain the deleted items
    setLineItems((lineItems) => {
      if (!lineItems) return lineItemsProp;

      const newItems = lineItemsProp.filter((lineItem) => !lineItems.find((item) => lineItem.id === item.id));

      return [
        ...lineItems
          .filter((item) => !item.undoProcessing)
          .map((lineItem) => {
            const item = lineItemsProp.find((item) => lineItem.id === item.id);

            return { ...(item ?? lineItem), deleted: !item };
          }),
        ...newItems,
      ];
    });
  }, [lineItemsProp]);

  const onUndoRemove = useCallback(
    async (lineItemId: string) => {
      const item = lineItems?.find((item) => item.id === lineItemId);

      const newItems = (lineItems ?? []).map((item) =>
        item.id !== lineItemId ? item : { ...item, undoProcessing: true },
      );

      setLineItems(newItems);

      if (item) await onAdd(item.sku ?? '', item.quantity ?? 1);
    },
    [lineItems, onAdd],
  );

  const onClearItem = (itemId: string) => {
    setLineItems((items) => items?.filter((item) => item.id !== itemId));
  };

  const closeFlyouts = useCloseFlyouts();

  const defaultCheckoutCTAProps: CheckoutCTAProps = {
    text: translate('cart.checkout-go'),
    link: '/checkout',
    quoteCheckoutLink: '/quote-checkout',
    onCheckout: closeFlyouts,
    onRequestQuote: closeFlyouts,
    onClear,
    checkoutDisabled,
    quoteRequestDisabled,
    disabled: allItemsAreDeleted || containsOutOfStockItem,
  };

  if (viewCartDisabled) {
    return (
      <div className="relative p-4 md:bg-neutral-200 md:px-5 md:py-6 lg:p-12">
        <div className="grid w-full place-items-center gap-12 rounded-lg bg-white py-9 pb-[80px]">
          <div className="grid place-items-center gap-6">
            <p className="text-center text-16 text-gray-700 md:text-18 lg:text-20">{translate('cart.view-disabled')}</p>

            <Image src="/images/locked-cart.png" className="w-[200px] md:w-[256px] lg:w-[328px]" alt="Cart locked" />
          </div>

          <p className="max-w-[720px] text-center text-14 leading-loose text-gray-600 md:text-16">
            {translate('cart.view-disabled-desc')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-neutral-200">
      {!invalidAddressesRequirements && (quoteRequestDisabled || checkoutDisabled) && (
        <div className="px-4 pt-3 md:px-8 lg:px-11">
          <InfoBanner>
            <b>{translate('common.view-only')}</b> {translate('cart.checkout-request-disabled')}
          </InfoBanner>
        </div>
      )}

      {invalidAddressesRequirements && (
        <div className="px-4 pt-3 md:px-8 lg:px-11">
          <InfoBanner>
            <b>{translate('cart.checkout-unavailable')}</b>: {translate('cart.invalid-addresses-requirements')}
          </InfoBanner>
        </div>
      )}

      <div className="flex flex-col bg-white py-4 md:py-6 lg:flex-row lg:items-start lg:gap-6 lg:bg-transparent lg:p-12">
        <CartContent
          loading={loading}
          lineItems={lineItems ?? []}
          discountCodes={discountCodes}
          className="grow bg-white px-4 pt-3 md:px-6 lg:rounded-lg lg:p-9"
          onAdd={onAdd}
          onUndoRemove={onUndoRemove}
          onClearItem={onClearItem}
          {...props}
        />

        {(lineItems ?? []).length > 0 ? (
          <>
            <OrderSummary
              className="min-w-[432px] grow bg-white lg:rounded-lg"
              title={translate('cart.order-summary')}
              paymentMethods={paymentMethods}
              button={<CheckoutCTA className={classnames('hidden w-full md:grid')} {...defaultCheckoutCTAProps} />}
              transaction={transaction}
              discounts={discountCodes}
              onDiscountRedeem={onDiscountRedeem}
              codeApplied={codeApplied}
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
