import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import TextArea from '@/components/atoms/text-area';
import { QuoteThankYouProps } from '../../types';

const OrderInfo = ({
  quoteRequestId,
  deliveryAddress,
  deliveryMethod,
  paymentMethod,
  billingAddress,
  comment,
  purchaseOrderNumber,
}: Omit<QuoteThankYouProps, 'account' | 'lineItems' | 'transaction'>) => {
  const { translate } = useTranslation();

  return (
    <div className="flex flex-col gap-4 border-b border-neutral-400 py-6 text-14 md:gap-6 md:text-16">
      <div className="gap-1 md:flex md:gap-5">
        <span className="text-gray-600 md:w-[136px]">{translate('thank-you.quote.request.id')}: </span>
        <span className="font-semibold leading-loose text-gray-700">{quoteRequestId}</span>
      </div>

      {purchaseOrderNumber && (
        <div className="gap-1 md:flex md:gap-5">
          <span className="text-gray-600 md:min-w-[136px]">{translate('checkout.purchase.order')}: </span>
          <span className="font-semibold leading-loose text-gray-700">{purchaseOrderNumber}</span>
        </div>
      )}

      {deliveryMethod && (
        <div className="gap-1 md:flex md:gap-5">
          <span className="text-gray-600 md:w-[136px]">{translate('thank-you.delivery.method')}: </span>
          <span className="font-semibold leading-loose text-gray-700">{deliveryMethod}</span>
        </div>
      )}

      {deliveryAddress && (
        <div className="gap-1 md:flex md:gap-5">
          <span className="text-gray-600 md:w-[136px]">{translate('thank-you.delivery.address')}: </span>
          <p className="inline font-normal leading-loose text-gray-700 md:hidden">
            <span className="font-semibold text-gray-700">{deliveryAddress.name}</span>
            {deliveryAddress.careOf ? ` (c/o ${deliveryAddress.careOf})` : ''}, {deliveryAddress.zip}{' '}
            {deliveryAddress.city}, {deliveryAddress.country}
          </p>
          <p className="hidden leading-loose text-gray-700 md:inline">
            <span className="font-semibold text-gray-700">
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
        <div className="gap-1 md:flex md:gap-5">
          <span className="font-normal text-gray-600 md:w-[136px]">{translate('thank-you.billing.address')}: </span>
          <p className="inline font-normal leading-loose md:hidden">
            <span className="font-semibold text-gray-700">{billingAddress.name}</span>
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
          <span className="font-semibold leading-loose text-gray-700">{paymentMethod}</span>
        </div>
      )}

      {comment && (
        <div className="gap-1 text-gray-600 md:flex md:gap-5">
          <span className="md:w-[136px]">{translate('common.comment')}: </span>
          <div className="grow">
            <TextArea className="min-h-[100px]" value={comment} />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderInfo;
