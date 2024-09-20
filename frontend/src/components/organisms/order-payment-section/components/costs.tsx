import { useParams } from 'next/navigation';
import { classnames } from '@/utils/classnames/classnames';
import { CurrencyHelpers } from '@/utils/currency-helpers';
import Typography from '@/components/atoms/typography';
import useCostsData from '../hooks/useCostsData';
import { CostsProps } from '../types';

const Costs = ({
  className,
  order,
  cart,
  dataReference = 'cart',
  subCostsContainerClassName,
  subCostClassName,
  totalAmountClassName,
}: CostsProps) => {
  const { locale } = useParams();
  const { loading, costsToRender, total } = useCostsData({ dataReference, order, cart });

  const totalAmountClassNames = classnames('mt-6 flex items-center justify-between font-medium', totalAmountClassName);

  const subCostsContainerClassNames = classnames('grid gap-2', subCostsContainerClassName);
  const subCostsClassNames = classnames(
    'flex items-center justify-between capitalize text-neutral-900',
    subCostClassName,
  );

  return (
    <div className={className}>
      <div className={subCostsContainerClassNames}>
        {costsToRender.map(({ key, label, value }) =>
          value?.centAmount && value.centAmount > 0 ? (
            <div key={key} className={subCostsClassNames}>
              <Typography asSkeleton={loading}>{label}</Typography>
              <Typography asSkeleton={loading}>{CurrencyHelpers.formatForCurrency(value, locale)}</Typography>
            </div>
          ) : (
            <></>
          ),
        )}
      </div>

      <div className={totalAmountClassNames}>
        <Typography asSkeleton={loading}>{total.label}</Typography>
        <Typography asSkeleton={loading}>{CurrencyHelpers.formatForCurrency(total.value, locale)}</Typography>
      </div>
    </div>
  );
};

export default Costs;
