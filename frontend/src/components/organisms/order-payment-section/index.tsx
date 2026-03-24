import React, { FC } from 'react';
import { classnames } from '@/utils/classnames/classnames';
import Costs from '@/components/molecules/costs';
import DiscountsForm from '@/components/molecules/discounts-form';
import PaymentMethods from './components/payment-methods';
import { OrderSummaryProps } from '../order-summary/types';

const OrderPaymentSection: FC<OrderSummaryProps> = ({
  className,
  paymentMethods = [],
  button,
  classNames,
  order,
  transaction,
  discounts,
  onDiscountRedeem,
  ...props
}) => {
  const infoContainerClassName = classnames('border-t border-neutral-400 bg-white', classNames?.infoContainer);

  return (
    <div className={className} {...props}>
      {!order && (
        <DiscountsForm
          className={classNames?.applyDiscountButton}
          discounts={discounts ?? []}
          onSubmit={onDiscountRedeem}
        />
      )}

      <div className={infoContainerClassName}>
        <Costs
          classNames={{ container: 'pt-4 md:pt-6 lg:pt-11' }}
          subtotal={transaction?.subtotal.centAmount ?? 0}
          shipping={transaction?.shipping.centAmount ?? 0}
          isShippingEstimated={transaction?.shipping.isEstimated}
          discount={transaction?.discount.centAmount ?? 0}
          tax={transaction?.tax.centAmount ?? 0}
          total={transaction?.total.centAmount ?? 0}
          currency={transaction?.total.currencyCode ?? 'USD'}
        />

        {button}

        {paymentMethods.length > 0 && <PaymentMethods paymentMethods={paymentMethods} />}
      </div>
    </div>
  );
};

export default OrderPaymentSection;
