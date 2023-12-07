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
  ...props
}) => {
  const infoContainerClassName = classnames('border-t border-neutral-400 bg-white', classNames?.infoContainer);

  return (
    <div className={className} {...props}>
      {!order && <DiscountsForm className={classNames?.applyDiscountButton} discounts={[]} />}

      <div className={infoContainerClassName}>
        <Costs
          classNames={{ container: 'py-4 md:py-6 lg:pb-11' }}
          subtotal={transaction.subtotal.centAmount}
          shipping={transaction.shipping.centAmount}
          discount={transaction.discount.centAmount}
          tax={transaction.tax.centAmount}
          total={transaction.total.centAmount}
          currency={transaction.total.currencyCode}
        />

        {button}

        {paymentMethods.length > 0 && <PaymentMethods paymentMethods={paymentMethods} />}
      </div>
    </div>
  );
};

export default OrderPaymentSection;
