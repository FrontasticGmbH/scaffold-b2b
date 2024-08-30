import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Link from '@/components/atoms/link';
import { CheckoutProps } from './types';
import CheckoutProvider from './provider';
import OrderSummary from './components/order-summary';
import Steps from './components/steps';
import CompletePurchase from './components/complete-purchase';

const Checkout = ({
  addresses,
  onAddAddress,
  transaction,
  products,
  discounts,
  onApplyDiscount,
  onCompleteAddresses,
  onCompleteShipping,
  onCompletePayment,
  termsAndConditionsLink,
  onSubmitPurchase,
  countryOptions = [],
  initialData = {},
  shippingMethods = [],
  paymentMethods = [],
  translations = {},
  buyerCanAddComment = false,
}: CheckoutProps) => {
  const { translate } = useTranslation();

  return (
    <CheckoutProvider buyerCanAddComment={buyerCanAddComment}>
      <div className="min-h-screen p-4 md:px-5 lg:bg-neutral-200 lg:px-12 lg:py-6">
        <div className="hidden border-b border-neutral-400 pb-5 pt-3 lg:block">
          <p className="text-20 capitalize leading-normal text-gray-700">
            {translations.header || translate('checkout.secure.checkout')}
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row-reverse lg:items-start lg:justify-between lg:gap-6 lg:pt-6">
          <OrderSummary
            transaction={transaction}
            products={products}
            discounts={discounts}
            onApplyDiscount={onApplyDiscount}
            onSubmitPurchase={onSubmitPurchase}
            translations={translations}
            buyerCanAddComment={buyerCanAddComment}
          />
          <Steps
            addresses={addresses}
            onAddAddress={onAddAddress}
            onCompleteAddresses={onCompleteAddresses}
            countryOptions={countryOptions}
            initialData={initialData}
            shippingMethods={shippingMethods}
            onCompleteShipping={onCompleteShipping}
            paymentMethods={paymentMethods}
            onCompletePayment={onCompletePayment}
            translations={translations}
          />
        </div>

        <CompletePurchase
          onSubmitPurchase={onSubmitPurchase}
          buyerCanAddComment={buyerCanAddComment}
          translations={translations}
        />

        <div className="mt-5 text-center text-12 text-gray-600 md:mt-6 md:text-14 lg:mt-[108px]">
          <p>
            {translate('checkout.by.placing.order')}{' '}
            <Link
              href={termsAndConditionsLink?.href ?? '#'}
              openInNewTab
              className="underline transition hover:text-gray-500"
            >
              {translate('checkout.terms.and.conditions')}
            </Link>{' '}
            {translate('checkout.of.the.b2b.store')}.
          </p>
          <p className="mt-3 md:mt-4 lg:mt-6">{translate('checkout.powered.by')}</p>
        </div>
      </div>
    </CheckoutProvider>
  );
};

export default Checkout;
