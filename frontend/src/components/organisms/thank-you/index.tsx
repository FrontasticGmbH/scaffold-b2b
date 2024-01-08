import React from 'react';
import { ThankYouProps } from './types';
import Acknowledge from './components/acknowledge';
import OrderInfo from './components/order-info';
import ReviewOrder from './components/review-order';
import OrderSummary from './components/order-summary';

const ThankYou = ({
  account,
  orderNumber,
  deliveryAddress,
  deliveryMethod,
  paymentMethod,
  billingAddress,
  onReviewOrderClick,
  transaction,
  lineItems = [],
}: ThankYouProps) => {
  return (
    <div className="min-h-screen items-start gap-6 px-4 md:px-5 lg:flex lg:bg-neutral-200 lg:px-12 lg:py-9">
      <div className="lg:grow lg:rounded-lg lg:bg-white lg:p-6 lg:pb-9">
        <Acknowledge account={account} />
        <OrderInfo
          orderNumber={orderNumber}
          deliveryMethod={deliveryMethod}
          deliveryAddress={deliveryAddress}
          paymentMethod={paymentMethod}
          billingAddress={billingAddress}
        />
        <ReviewOrder onReviewOrderClick={onReviewOrderClick} />
      </div>
      <div className="pb-6 pt-4 md:pt-6 lg:w-[432px] lg:shrink-0 lg:rounded-lg lg:bg-white lg:p-9">
        <OrderSummary lineItems={lineItems} transaction={transaction} />
      </div>
    </div>
  );
};

export default ThankYou;
