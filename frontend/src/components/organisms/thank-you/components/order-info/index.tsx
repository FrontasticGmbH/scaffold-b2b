import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { ThankYouProps } from '../../types';

const OrderInfo = ({
  orderNumber,
  deliveryAddress,
  deliveryMethod,
  paymentMethod,
  billingAddress,
  purchaseOrderNumber,
}: Omit<ThankYouProps, 'account' | 'lineItems' | 'transaction'>) => {
  const { translate } = useTranslation();

  return (
    <div className="flex flex-col gap-4 border-b border-neutral-400 py-6 text-14 md:gap-6 md:text-16">
      <div className="gap-1 md:flex md:gap-5">
        <span className="text-gray-600 md:w-[136px]">{translate('thank-you.order.number')}: </span>
        <span className="font-semibold leading-loose text-gray-600">{orderNumber}</span>
      </div>

      {purchaseOrderNumber && (
        <div className="gap-1 md:flex md:gap-5">
          <span className="text-gray-600 md:w-[136px]">{translate('checkout.purchase.order')}: </span>
          <span className="font-semibold leading-loose text-gray-600">{purchaseOrderNumber}</span>
        </div>
      )}

      {deliveryMethod && (
        <div className="gap-1 md:flex md:gap-5">
          <span className="text-gray-600 md:w-[136px]">{translate('thank-you.delivery.method')}: </span>
          <span className="font-semibold leading-loose text-gray-600">{deliveryMethod}</span>
        </div>
      )}

      {deliveryAddress && (
        <div className="gap-1 md:flex md:gap-5">
          <span className="text-gray-600 md:w-[136px]">{translate('thank-you.delivery.address')}: </span>
          <p className="inline leading-loose text-gray-600 md:hidden">
            <span className="font-medium">{deliveryAddress.name}</span>
            {deliveryAddress.careOf ? ` (c/o ${deliveryAddress.careOf})` : ''}, {deliveryAddress.zip}{' '}
            {deliveryAddress.city}, {deliveryAddress.country}
          </p>
          <p className="hidden leading-loose text-gray-600 md:inline">
            <span className="font-semibold">
              {deliveryAddress.name} {deliveryAddress.careOf ? `(c/o ${deliveryAddress.careOf})` : ''}
            </span>
            <br />
            <span className="block md:mt-1 lg:mt-2">
              {deliveryAddress.zip} {deliveryAddress.city}, {deliveryAddress.country}
            </span>
          </p>
        </div>
      )}

      {billingAddress && (
        <div className="gap-1 text-gray-600 md:flex md:gap-5">
          <span className="md:w-[136px]">{translate('thank-you.billing.address')}: </span>
          <p className="inline leading-loose md:hidden">
            <span className="font-medium">{billingAddress.name}</span>
            {billingAddress.careOf ? ` (c/o ${billingAddress.careOf})` : ''}, {billingAddress.zip} {billingAddress.city}
            , {billingAddress.country}
          </p>
          <p className="hidden leading-loose md:inline">
            <span className="font-semibold">
              {billingAddress.name} {billingAddress.careOf ? `(c/o ${billingAddress.careOf})` : ''}
            </span>
            <br />
            <span className="block md:mt-1 lg:mt-2">
              {billingAddress.zip} {billingAddress.city}, {billingAddress.country}
            </span>
          </p>
        </div>
      )}

      {paymentMethod && (
        <div className="gap-1 md:flex md:gap-5">
          <span className="text-gray-600 md:w-[136px]">{translate('thank-you.payment.method')}: </span>
          <span className="font-semibold leading-loose text-gray-600">{paymentMethod}</span>
        </div>
      )}
    </div>
  );
};

export default OrderInfo;
