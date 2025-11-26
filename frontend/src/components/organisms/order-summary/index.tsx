import { classnames } from '@/utils/classnames/classnames';
import DiscountsForm from '@/components/molecules/discounts-form';
import { useTranslations } from 'use-intl';
import OrderPaymentSection from '../order-payment-section';
import { OrderSummaryProps } from './types';
import SummaryAccordion from './components/summary-accordion';
import OrderItemsListing from '../order-items-listing';

const OrderSummary = ({
  title,
  className,
  includeSummaryAccordion,
  includeItemsList,
  transaction,
  discounts,
  onDiscountRedeem,
  codeApplied,
  ...props
}: OrderSummaryProps) => {
  const translate = useTranslations();

  const itemsListClassName = classnames('mb-6 border-y border-neutral-400', props.classNames?.itemsList);

  return (
    <div className={classnames(className, 'px-5 pb-5 md:p-9')}>
      {title && (
        <div className="hidden pb-2 lg:block">
          <p className="text-18 font-semibold md:text-20">{title}</p>
        </div>
      )}

      {includeItemsList && props.order?.lineItems && (
        <OrderItemsListing className={itemsListClassName} lineItems={props.order?.lineItems} />
      )}

      {includeSummaryAccordion && (
        <SummaryAccordion className="lg:hidden" order={props.order} cart={props.cart} transaction={transaction} />
      )}

      {includeSummaryAccordion && (
        <DiscountsForm
          className={`${props.classNames?.applyDiscountButton} block lg:hidden`}
          discounts={discounts ?? []}
          onSubmit={onDiscountRedeem}
          customError={translate('cart.quote-cannot-apply-discount')}
          codeApplied={codeApplied}
        />
      )}

      {!includeSummaryAccordion && (
        <OrderPaymentSection
          className={`${!includeSummaryAccordion ? '' : 'hidden lg:block'}`}
          transaction={transaction}
          discounts={discounts ?? []}
          onDiscountRedeem={onDiscountRedeem}
          classNames={{
            applyDiscountButton: 'py-3 text-16',
          }}
          codeApplied={codeApplied}
          {...props}
        />
      )}
    </div>
  );
};

export default OrderSummary;
