import { classnames } from '@/utils/classnames/classnames';
import Typography from '@/components/atoms/typography';
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
  loading = false,
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
              <Typography fontSize={14} className="text-14 md:text-16" asSkeleton={loading}>
                {label}
              </Typography>
              <Typography fontSize={14} className="text-14 md:text-16" asSkeleton={loading}>
                {formatCurrency(value, currency)}
              </Typography>
            </div>
          ))}
      </div>

      <div className={totalAmountClassNames}>
        <Typography className="text-16 text-gray-700 md:text-18" fontWeight="medium" asSkeleton={loading}>
          {`${translate('cart.total')}:`}
        </Typography>
        <Typography className="text-16 text-gray-700 md:text-18" fontWeight="medium" asSkeleton={loading}>
          {formatCurrency(total, currency)}
        </Typography>
      </div>
    </div>
  );
};

export default Costs;
