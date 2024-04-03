import { classnames } from '@/utils/classnames/classnames';
import Typography from '@/components/atoms/typography';
import DiscountsForm from '@/components/molecules/discounts-form';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
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
  ...props
}: OrderSummaryProps) => {
  const { translate } = useTranslation();

  const itemsListClassName = classnames('mb-6 border-y border-neutral-400', props.classNames?.itemsList);

  return (
    <div className={className}>
      {title && (
        <div className="hidden py-4 md:py-6 lg:block lg:pb-6 lg:pt-0">
          <Typography fontSize={16} className="md:text-18">
            {title}
          </Typography>
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
          customError={translate('cart.quote.cannot.apply.discount')}
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
            totalAmount: 'text-18 md:pb-5',
            subCostsContainer: 'pt-3 md:pt-4 mb-5 lg:py-6 lg:mb-4 lg:border-b border-neutral-400',
          }}
          {...props}
        />
      )}
    </div>
  );
};

export default OrderSummary;
