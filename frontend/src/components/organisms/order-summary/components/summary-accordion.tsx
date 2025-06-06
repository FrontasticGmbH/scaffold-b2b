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
        subtotal={transaction?.subtotal.centAmount ?? 0}
        shipping={transaction?.shipping.centAmount ?? 0}
        discount={transaction?.discount.centAmount ?? 0}
        tax={transaction?.tax.centAmount ?? 0}
        total={transaction?.total.centAmount ?? 0}
        currency={transaction?.total.currencyCode ?? 'USD'}
      />
    </Accordion>
  );
};

export default SummaryAccordion;
