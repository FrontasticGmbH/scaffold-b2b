import { useMemo } from 'react';
import Typography from '@/components/atoms/typography';
import { classnames } from '@/utils/classnames/classnames';
import { TruckIcon } from '@heroicons/react/24/outline';
import useFormat from '@/hooks/useFormat';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { ShippingMethodProps } from '../types';
import { getEstimatedDeliveryDate } from '../helpers/getEstimatedDeliveryDate';

const ShippingMethod = ({ className, label, price, estimatedDeliveryDays, currency }: ShippingMethodProps) => {
  const { translate } = useTranslation();
  const { formatCurrency } = useFormat();

  const estimatedDeliveryDate = useMemo(() => getEstimatedDeliveryDate(estimatedDeliveryDays), [estimatedDeliveryDays]);

  const methodClassName = classnames('flex items-center gap-5 border-neutral-300 p-4', className);

  return (
    <div className={methodClassName}>
      <div className="grid size-7 place-content-center rounded-full border border-neutral-300">
        <TruckIcon className="size-4" />
      </div>
      <div className="grid gap-2">
        {/* Label & Price */}
        <div className="flex flex-wrap">
          <Typography className="text-gray-700" fontSize={14} fontWeight="medium" lineHeight="tight">
            {`${label} - `}
          </Typography>
          <Typography className="text-gray-800" fontWeight="semibold" fontSize={14} lineHeight="tight">
            {formatCurrency(price, currency)}
          </Typography>
        </div>

        {/* Est. delivery date */}
        <div>
          <Typography className="text-gray-600" fontSize={14} lineHeight="tight">
            {translate('cart.shipping.est', { values: { date: estimatedDeliveryDate } })}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ShippingMethod;
