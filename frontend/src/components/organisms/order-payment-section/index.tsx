import React, { FC } from 'react';
import { classnames } from '@/utils/classnames/classnames';
import Costs from '@/components/molecules/costs';
import DiscountsForm from '@/components/molecules/discounts-form';
import useDisclosure from '@/hooks/useDisclosure';
import { OrderSummaryProps } from '../order-summary/types';
import PaymentMethods from './components/payment-methods';

const OrderPaymentSection: FC<OrderSummaryProps> = ({
  className,
  paymentMethods = [],
  button,
  classNames,
  order,
  transaction,
  discounts,
  onDiscountRedeem,
  codeApplied,
  ...props
}) => {
  const { isOpen: isExpanded, onOpen: onExpanded, onClose: onCollapsed } = useDisclosure();

  const infoContainerClassName = classnames('bg-white', classNames?.infoContainer, {
    'border-t border-gray-300 pt-4': !isExpanded,
    'pb-4 pt-1': isExpanded,
  });

  const cartLevelDiscounts = transaction?.discount.segments.filter((segment) => segment.targetsTotal);

  return (
    <div className={className} {...props}>
      {!order && (
        <DiscountsForm
          className={classNames?.applyDiscountButton}
          discounts={discounts ?? []}
          onSubmit={onDiscountRedeem}
          onExpanded={onExpanded}
          onCollapsed={onCollapsed}
          codeApplied={codeApplied}
        />
      )}

      <div className={infoContainerClassName}>
        <Costs
          classNames={{
            subCosts: classNames?.subCost,
            subCostsContainer: classNames?.subCostsContainer,
          }}
          subtotal={transaction?.subtotal.centAmount ?? 0}
          shipping={transaction?.shipping.centAmount}
          isShippingEstimated={transaction?.shipping.isEstimated}
          shippingIncludesTaxes={transaction?.shipping.includesTaxes}
          discount={transaction?.discount.centAmount ?? 0}
          discountSegments={transaction?.discount.segments}
          tax={transaction?.tax.centAmount}
          total={transaction?.total.centAmount ?? 0}
          currency={transaction?.total.currencyCode ?? 'USD'}
          fractionDigits={transaction?.total.fractionDigits ?? 2}
        />

        {button}

        {paymentMethods.length > 0 && <PaymentMethods paymentMethods={paymentMethods} />}
      </div>
    </div>
  );
};

export default OrderPaymentSection;
