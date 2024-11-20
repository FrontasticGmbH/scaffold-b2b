import React from 'react';
import { QuoteThankYouProps } from './types';
import Acknowledge from './components/acknowledge';
import OrderInfo from './components/order-info';
import ReviewOrder from './components/review-order';
import OrderSummary from './components/order-summary';

const QuoteThankYou = ({
  account,
  quoteRequestId,
  deliveryAddress,
  deliveryMethod,
  paymentMethod,
  billingAddress,
  comment,
  onReviewQuoteClick,
  transaction,
  lineItems = [],
  purchaseOrderNumber,
}: QuoteThankYouProps) => {
  return (
    <div className="min-h-screen items-start gap-6 px-4 md:px-5 lg:flex lg:bg-neutral-200 lg:px-12 lg:py-9">
      <div className="lg:grow lg:rounded-lg lg:bg-white lg:p-6 lg:pb-9">
        <Acknowledge account={account} />
        <OrderInfo
          quoteRequestId={quoteRequestId}
          deliveryMethod={deliveryMethod}
          deliveryAddress={deliveryAddress}
          paymentMethod={paymentMethod}
          billingAddress={billingAddress}
          comment={comment}
          purchaseOrderNumber={purchaseOrderNumber}
        />
        <ReviewOrder onReviewQuoteClick={onReviewQuoteClick} />
      </div>
      <div className="pb-6 pt-4 md:pt-6 lg:w-[432px] lg:shrink-0 lg:rounded-lg lg:bg-white lg:p-9">
        <OrderSummary lineItems={lineItems} transaction={transaction} />
      </div>
    </div>
  );
};

export default QuoteThankYou;
