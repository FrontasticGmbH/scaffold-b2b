import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { ThankYouProps } from '../../types';

const OrderInfo = ({
  orderNumber,
  deliveryAddress,
  deliveryMethod,
  paymentMethod,
  billingAddress,
}: Omit<ThankYouProps, 'account' | 'lineItems' | 'transaction'>) => {
  const { translate } = useTranslation();

  return (
    <div className="flex flex-col gap-4 border-b border-neutral-400 py-6 text-14 md:gap-6 md:text-16">
      <div className="gap-1 md:flex md:gap-4">
        <span className="text-neutral-900 md:w-[136px]">{translate('thank-you.order.number')}: </span>
        <span className="font-medium leading-loose text-gray-700">{orderNumber}</span>
      </div>

      {deliveryMethod && (
        <div className="gap-1 md:flex md:gap-4">
          <span className="text-neutral-900 md:w-[136px]">{translate('thank-you.delivery.method')}: </span>
          <span className="font-medium leading-loose text-gray-700">{deliveryMethod}</span>
        </div>
      )}

      {deliveryAddress && (
        <div className="gap-1 md:flex md:gap-4">
          <span className="text-neutral-900 md:w-[136px]">{translate('thank-you.delivery.address')}: </span>
          <p className="inline leading-loose text-gray-700 md:hidden">
            <span className="font-medium">{deliveryAddress.name}</span>
            {deliveryAddress.careOf ? ` (c/o ${deliveryAddress.careOf})` : ''}, {deliveryAddress.zip}{' '}
            {deliveryAddress.city}, {deliveryAddress.country}
          </p>
          <p className="hidden leading-loose text-gray-700 md:inline">
            <span className="font-medium">
              {deliveryAddress.name} {deliveryAddress.careOf ? `(c/o ${deliveryAddress.careOf})` : ''}
            </span>
            <br />
            <span className="block md:mt-1 lg:mt-2">
              {deliveryAddress.zip} {deliveryAddress.city}, {deliveryAddress.country}
            </span>
          </p>
        </div>
      )}

      {paymentMethod && (
        <div className="gap-1 md:flex md:gap-4">
          <span className="text-neutral-900 md:w-[136px]">{translate('thank-you.payment.method')}: </span>
          <span className="font-medium leading-loose text-gray-700">{paymentMethod}</span>
        </div>
      )}

      {billingAddress && (
        <div className="gap-1 text-neutral-900 md:flex md:gap-4">
          <span className="md:w-[136px]">{translate('thank-you.billing.address')}: </span>
          <p className="inline leading-loose md:hidden">
            <span className="font-medium">{billingAddress.name}</span>
            {billingAddress.careOf ? ` (c/o ${billingAddress.careOf})` : ''}, {billingAddress.zip} {billingAddress.city}
            , {billingAddress.country}
          </p>
          <p className="hidden leading-loose md:inline">
            <span className="font-medium">
              {billingAddress.name} {billingAddress.careOf ? `(c/o ${billingAddress.careOf})` : ''}
            </span>
            <br />
            <span className="block md:mt-1 lg:mt-2">
              {billingAddress.zip} {billingAddress.city}, {billingAddress.country}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderInfo;
