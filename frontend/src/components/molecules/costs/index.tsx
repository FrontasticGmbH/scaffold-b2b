import { useCallback, useState } from 'react';
import { classnames } from '@/utils/classnames/classnames';
import { useTranslations } from 'use-intl';
import useFormat from '@/hooks/useFormat';
import { ChevronDownIcon as ArrowIcon } from '@heroicons/react/24/outline';
import { formatCentAmount } from '@/lib/utils/format-price';
import { CostsProps } from './types';
import Accordion from '../accordion';

const Costs = ({
  shipping,
  subtotal,
  total,
  discount,
  discountSegments,
  tax,
  currency = 'USD',
  classNames = {},
  fractionDigits,
  isShippingEstimated,
}: CostsProps) => {
  const translate = useTranslations();

  const { formatCurrency } = useFormat();

  const defaultDiscountsExpanded = true;
  const [discountsExpanded, setDiscountsExpanded] = useState(defaultDiscountsExpanded);

  const formatValue = useCallback(
    (value: number) => {
      const formattedValue = fractionDigits ? formatCentAmount(value, fractionDigits) : value;
      return formatCurrency(formattedValue, currency);
    },
    [fractionDigits, formatCurrency, currency],
  );

  const renderCost = useCallback(
    ({ label, value }: { label: string; value: number }) => {
      return (
        <div className={classnames('flex items-center justify-between capitalize text-gray-700', classNames.subCosts)}>
          <span className="text-14 font-semibold md:text-16">{label}</span>
          <span className="text-14 md:text-16">{formatValue(value)}</span>
        </div>
      );
    },
    [formatValue, classNames.subCosts],
  );

  const renderCalculatedLaterCost = useCallback(
    ({ label }: { label: string }) => {
      return (
        <div className={classnames('flex items-center justify-between capitalize text-gray-700', classNames.subCosts)}>
          <span className="text-14 font-semibold md:text-16">{label}</span>
          <span className="text-14 md:text-16">{translate('checkout.calculated-later')}</span>
        </div>
      );
    },
    [translate, classNames.subCosts],
  );

  const totalDiscountSegments = (discountSegments ?? []).filter((segment) => !segment.targetsShipping);
  const shippingDiscountSegment = (discountSegments ?? []).find((segment) => !!segment.targetsShipping);

  return (
    <div className={classNames.container}>
      <div className={classnames('grid gap-2 pb-4', classNames.subCostsContainer)}>
        {subtotal !== 0 && renderCost({ label: translate('cart.subtotal'), value: subtotal })}

        {discount !== 0 && (
          <Accordion
            defaultIsExpanded={defaultDiscountsExpanded}
            borderless
            onExpand={() => setDiscountsExpanded(true)}
            onCollapse={() => setDiscountsExpanded(false)}
          >
            <Accordion.Button defaultSpacing={false} withArrow={false}>
              <div className={classnames('flex items-center justify-between', classNames.subCosts)}>
                <div className="flex items-center gap-2">
                  <span className="text-14 font-semibold text-gray-700 md:text-16">{translate('cart.discounts')} </span>
                  <ArrowIcon
                    data-testid="arrow-icon"
                    width={18}
                    className={classnames('shrink-0 stroke-[2] text-gray-700', discountsExpanded ? 'rotate-180' : '')}
                  />
                </div>
                <span className="text-14 font-semibold text-green-700 md:text-16">-{formatValue(discount)}</span>
              </div>
            </Accordion.Button>

            <Accordion.Panel defaultSpacing={false} className="pt-1">
              <div className="flex flex-col items-stretch gap-1">
                {totalDiscountSegments
                  .filter(({ discountedAmount }) => discountedAmount > 0)
                  .map(({ source, label, discountedAmount }) => (
                    <div key={label} className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">
                        {source ? <span className="font-semibold">{source} - </span> : ''}
                        {translate(label as Parameters<typeof translate>[0])}
                      </span>
                      <span className="text-green-600">-{formatValue(discountedAmount)}</span>
                    </div>
                  ))}
              </div>
            </Accordion.Panel>
          </Accordion>
        )}

        {tax !== undefined && tax !== 0
          ? renderCost({ label: translate('cart.tax'), value: tax })
          : renderCalculatedLaterCost({ label: translate('cart.tax') })}

        {!isShippingEstimated && shipping !== undefined ? (
          <div className={classnames('flex items-center justify-between text-gray-700', classNames.subCosts)}>
            <span className="text-14 font-semibold md:text-16">
              {translate('cart.shipping')}{' '}
              <span className="font-normal text-gray-500">({translate('cart.includes-taxes')})</span>
            </span>

            {shipping === 0 ? (
              <span className="text-14 font-semibold text-green-500 md:text-16">{translate('cart.freeShipping')}</span>
            ) : !!shippingDiscountSegment?.value.value ? (
              <>
                {shippingDiscountSegment.value.value === 100 ? (
                  <span className="text-14 font-semibold text-green-500 md:text-16">
                    {translate('cart.freeShipping')}
                  </span>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-14 text-gray-500 line-through md:text-14">
                      {formatValue(
                        shippingDiscountSegment.discountedAmount / (shippingDiscountSegment.value.value / 100),
                      )}
                    </span>
                    <span className="text-14 font-semibold text-green-500 md:text-16">{formatValue(shipping)}</span>
                  </div>
                )}
              </>
            ) : (
              <span className="text-14 md:text-16">{formatValue(shipping)}</span>
            )}
          </div>
        ) : (
          renderCalculatedLaterCost({ label: translate('cart.shipping') })
        )}
      </div>

      <div
        className={classnames(
          'mb-1 flex items-center justify-between border-t border-gray-300 pt-4 font-medium md:mb-4',
          classNames.totalAmount,
        )}
      >
        <p className="text-16 font-semibold text-gray-700 md:text-18">{translate('cart.total')}</p>
        <p className="text-16 font-semibold text-gray-700 md:text-18">{formatValue(total)}</p>
      </div>
    </div>
  );
};

export default Costs;
