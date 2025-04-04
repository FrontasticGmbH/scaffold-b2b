import { classnames } from '@/utils/classnames/classnames';
import { useTranslations } from 'use-intl';
import useFormat from '@/hooks/useFormat';
import { CostsProps } from './types';

const Costs = ({
  shipping,
  subtotal,
  total,
  discount,
  tax,
  currency = 'USD',
  classNames = {},
  isShippingEstimated = true,
}: CostsProps) => {
  const translate = useTranslations();

  const { formatCurrency } = useFormat();

  const totalAmountClassNames = classnames(
    'mt-4 flex items-center justify-between border-t border-neutral-400 pt-4 font-medium md:mt-6',
    classNames.totalAmount,
  );

  const subCostsContainerClassNames = classnames('grid gap-2', classNames.subCostsContainer);
  const subCostsClassNames = classnames(
    'flex items-center justify-between capitalize text-gray-600',
    classNames.subCosts,
  );

  const costs = [
    {
      key: 'subtotal',
      label: translate('cart.subtotal'),
      value: subtotal,
    },
    {
      key: 'shipping',
      label: translate(isShippingEstimated ? 'cart.shipping-estimate' : 'cart.shipping'),
      value: shipping,
    },
    {
      key: 'tax',
      label: translate('cart.tax'),
      value: tax,
    },
    {
      key: 'discount',
      label: translate('cart.discount'),
      value: -discount,
    },
  ];

  return (
    <div className={classNames.container}>
      <div className={subCostsContainerClassNames}>
        {costs
          .filter(({ value }) => value != 0)
          .map(({ key, label, value }) => (
            <div key={key} className={subCostsClassNames}>
              <p className="text-14 md:text-16">{label}</p>
              <p className="text-14 md:text-16">{formatCurrency(value, currency)}</p>
            </div>
          ))}
      </div>

      <div className={totalAmountClassNames}>
        <p className="text-16 font-medium text-gray-700 md:text-18">{`${translate('cart.total')}:`}</p>
        <p className="text-16 font-medium text-gray-700 md:text-18">{formatCurrency(total, currency)}</p>
      </div>
    </div>
  );
};

export default Costs;
