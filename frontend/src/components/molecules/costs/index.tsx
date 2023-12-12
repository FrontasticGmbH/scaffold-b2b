import { classnames } from '@/utils/classnames/classnames';
import Typography from '@/components/atoms/typography';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
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
}: CostsProps) => {
  const { translate } = useTranslation();

  const { formatCurrency } = useFormat();

  const totalAmountClassNames = classnames(
    'mt-6 flex items-center justify-between border-t border-neutral-400 pt-4 font-medium',
    classNames.totalAmount,
  );

  const subCostsContainerClassNames = classnames('grid gap-2', classNames.subCostsContainer);
  const subCostsClassNames = classnames(
    'flex items-center justify-between capitalize text-neutral-900',
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
      label: translate('cart.shipping.estimate'),
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
      value: discount,
    },
  ];

  return (
    <div className={classNames.container}>
      <div className={subCostsContainerClassNames}>
        {costs.map(({ key, label, value }) => (
          <div key={key} className={subCostsClassNames}>
            <Typography className="text-14 md:text-16" asSkeleton={loading}>
              {label}
            </Typography>
            <Typography className="text-14 md:text-16" asSkeleton={loading}>
              {formatCurrency(value, currency)}
            </Typography>
          </div>
        ))}
      </div>

      <div className={totalAmountClassNames}>
        <Typography className="text-16 md:text-18" fontWeight="medium" asSkeleton={loading}>
          {`${translate('cart.total')}:`}
        </Typography>
        <Typography className="text-16 md:text-18" fontWeight="medium" asSkeleton={loading}>
          {formatCurrency(total, currency)}
        </Typography>
      </div>
    </div>
  );
};

export default Costs;
