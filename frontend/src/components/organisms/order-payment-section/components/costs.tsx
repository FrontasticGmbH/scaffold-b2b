import { useParams } from 'next/navigation';
import { classnames } from '@/utils/classnames/classnames';
import { CurrencyHelpers } from '@/utils/currency-helpers';
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
  const params = useParams();
  const locale = params?.locale;
  const { costsToRender, total } = useCostsData({ dataReference, order, cart });

  const totalAmountClassNames = classnames('mt-6 flex items-center justify-between font-medium', totalAmountClassName);

  const subCostsContainerClassNames = classnames('grid gap-2', subCostsContainerClassName);
  const subCostsClassNames = classnames('flex items-center justify-between capitalize text-gray-600', subCostClassName);

  return (
    <div className={className}>
      <div className={subCostsContainerClassNames}>
        {costsToRender.map(({ key, label, value }) =>
          value?.centAmount && value.centAmount > 0 ? (
            <div key={key} className={subCostsClassNames}>
              <p>{label}</p>
              <p>{CurrencyHelpers.formatForCurrency(value, locale)}</p>
            </div>
          ) : (
            <></>
          ),
        )}
      </div>

      <div className={totalAmountClassNames}>
        <p>{total.label}</p>
        <p>{CurrencyHelpers.formatForCurrency(total.value, locale)}</p>
      </div>
    </div>
  );
};

export default Costs;
