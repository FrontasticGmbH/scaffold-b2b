import React from 'react';
import { useRouter } from 'next/router';
import { Cart } from '@shared/types/cart/Cart';
import { classnames } from '@/utils/classnames/classnames';
import Image from '@/components/atoms/Image';
import { CurrencyHelpers } from '@/utils/currency-helpers';
import Accordion from '@/components/molecules/accordion';
import useDisclosure from '@/hooks/useDisclosure';
import Costs from '@/components/molecules/costs';
import { calculateTransaction } from '@/lib/utils/calculate-transaction';
import { formatCentAmount, formatDiscountSegments } from '@/lib/utils/format-price';
import AccordionButton from './accordion-button';
import { SummaryAccordionProps } from '../types';

const SummaryAccordion = ({ className, order, cart, transaction }: SummaryAccordionProps) => {
  const data = { ...(order ?? cart) } as Cart;

  const { locale } = useRouter();

  const { isOpen, onToggle } = useDisclosure();

  const accordionClassNames = classnames('block lg:mt-40', className);

  const lineItemClassNames = (index: number) => {
    return `
      flex justify-start py-16
      ${data?.lineItems && index === data.lineItems.length - 1 ? '' : 'border-b'}`;
  };

  const { total } = calculateTransaction(data);

  return (
    <Accordion className={accordionClassNames} isExpanded={isOpen}>
      <AccordionButton open={isOpen} toggleAccordion={onToggle} total={total} />
      <Accordion.Panel className="grid max-h-[400px] w-full grid-cols-1 overflow-auto">
        {data?.lineItems?.map((lineItem, index) => (
          <div key={lineItem.lineItemId} className={lineItemClassNames(index)}>
            {lineItem.variant?.images?.[0] && (
              <div className="relative h-[104px] w-[88px] shrink-0">
                <Image src={lineItem.variant.images[0]} alt={lineItem.name ?? 'item image'} />
              </div>
            )}
            <div className="flex flex-col justify-center gap-8 pl-16 text-14 text-primary">
              <p>{lineItem?.name}</p>
              <p>{CurrencyHelpers.formatForCurrency(lineItem?.price as number, locale)}</p>
              <p>{`x ${lineItem?.count}`}</p>
            </div>
          </div>
        ))}
      </Accordion.Panel>

      <Costs
        classNames={{ container: 'bg-neutral-200 py-4 md:py-6 lg:pb-11' }}
        subtotal={formatCentAmount(transaction?.subtotal.centAmount ?? 0, transaction?.subtotal.fractionDigits ?? 2)}
        shipping={
          transaction?.shipping.centAmount
            ? formatCentAmount(transaction.shipping.centAmount, transaction.shipping.fractionDigits ?? 2)
            : undefined
        }
        isShippingEstimated={transaction?.shipping.isEstimated}
        shippingIncludesTaxes={transaction?.shipping.includesTaxes}
        discount={formatCentAmount(transaction?.discount.centAmount ?? 0, transaction?.discount.fractionDigits ?? 2)}
        discountSegments={formatDiscountSegments(
          transaction?.discount.segments ?? [],
          transaction?.discount.fractionDigits ?? 2,
        )}
        tax={
          transaction?.tax.centAmount
            ? formatCentAmount(transaction.tax.centAmount, transaction.tax.fractionDigits ?? 2)
            : undefined
        }
        total={formatCentAmount(transaction?.total.centAmount ?? 0, transaction?.total.fractionDigits ?? 2)}
        currency={transaction?.total.currencyCode ?? 'USD'}
      />
    </Accordion>
  );
};

export default SummaryAccordion;
