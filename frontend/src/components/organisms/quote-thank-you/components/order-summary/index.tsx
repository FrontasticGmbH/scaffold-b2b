import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import useFormat from '@/hooks/useFormat';
import Image from '@/components/atoms/Image';
import Link from '@/components/atoms/link';
import Costs from '@/components/molecules/costs';
import Accordion from '@/components/molecules/accordion';
import { QuoteThankYouProps } from '../../types';

const OrderSummary = ({ lineItems, transaction }: Pick<QuoteThankYouProps, 'lineItems' | 'transaction'>) => {
  const { translate } = useTranslation();

  const { formatCurrency } = useFormat();

  return (
    <div>
      <h5 className="lg:hidden">{translate('thank-you.quote.summary')}</h5>
      <h5 className="hidden lg:block lg:text-18">{translate('thank-you.quote.items')}</h5>

      <div className="lg:hidden">
        {lineItems.map(({ id, name, price, currency, quantity, images, url }) => (
          <div key={id} className="flex items-center gap-4 border-b border-neutral-400 py-4 md:gap-8">
            <div className="relative h-[104px] w-[89px] shrink-0">
              <Link href={url ?? '#'}>
                <Image src={images?.[0]} fill style={{ objectFit: 'contain' }} alt={name} />
              </Link>
            </div>
            <div className="flex grow items-center justify-between overflow-hidden">
              <div className="max-w-full grow">
                <Link
                  href={url ?? '#'}
                  className="mt-1 block max-w-full truncate py-1 text-16 font-semibold leading-loose text-gray-700"
                >
                  <p className="truncate text-12 text-gray-700 md:text-14">{name}</p>
                </Link>
                <p className="mt-2 text-12 font-medium text-gray-700 md:hidden">{formatCurrency(price, currency)}</p>
                <span className="mt-3 block text-14 text-gray-600 md:mt-2">x {quantity}</span>
              </div>
              <span className="hidden text-gray-700 md:block">{formatCurrency(price, currency)}</span>
            </div>
          </div>
        ))}
      </div>

      <Accordion className="mt-6 hidden border-none pb-4 lg:block" defaultIsExpanded>
        <Accordion.Button defaultSpacing={false} className="border-t border-neutral-400 pt-4">
          {translate('thank-you.your.order')}
        </Accordion.Button>
        <Accordion.Panel defaultSpacing={false} className="py-4">
          <div className="hidden pt-2 lg:block">
            <div className="flex items-center gap-4">
              {lineItems.slice(0, 3).map(({ id, images, name, url }) => (
                <div className="relative size-[88px]" key={id}>
                  <Link href={url ?? '#'}>
                    <Image src={images?.[0]} fill style={{ objectFit: 'contain' }} alt={name} />
                  </Link>
                </div>
              ))}
              {lineItems.length > 3 && <div className="pl-1 text-14 text-gray-600">+{lineItems.length - 3}</div>}
            </div>
          </div>
        </Accordion.Panel>
      </Accordion>

      <div className="pt-4 lg:border-t lg:border-neutral-400 lg:pt-6">
        <Costs
          subtotal={transaction.subtotal}
          shipping={transaction.shipping}
          isShippingEstimated={false}
          tax={transaction.taxes}
          discount={transaction.discounts}
          total={transaction.total}
          currency={transaction.currency}
          classNames={{ totalAmount: 'pt-[0px] border-transparent lg:pt-4 lg:border-neutral-400' }}
        />
      </div>
    </div>
  );
};

export default OrderSummary;
