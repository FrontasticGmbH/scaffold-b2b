import { useMemo } from 'react';
import Typography from '@/components/atoms/typography';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { ShippingProps } from '../types';
import ShippingMethod from './shipping-method';
import { getDeliveryRange } from '../helpers/getDeliveryRange';

const Shipping = ({ shippingMethods, currency }: ShippingProps) => {
  const { translate } = useTranslation();

  const averageDeliveryDays = useMemo(() => {
    const { minDeliveryDays, maxDeliveryDays } = getDeliveryRange(shippingMethods);
    return `${minDeliveryDays} - ${maxDeliveryDays} ${translate('common.days')}`;
  }, [translate, shippingMethods]);

  return (
    <div className="grid gap-3">
      <div className="flex justify-between">
        <Typography className="leading-[16px] text-gray-700" fontSize={14}>
          {translate('cart.delivery.time')}
        </Typography>
        <Typography asSkeleton={!shippingMethods.length} className="leading-[16px] text-green-500" fontSize={14}>
          {averageDeliveryDays}
        </Typography>
      </div>
      <div>
        {shippingMethods.map((method, index) => (
          <ShippingMethod
            key={method.label}
            className={index === 0 && shippingMethods.length > 1 ? 'border-x border-t' : 'border'}
            currency={currency}
            {...method}
          />
        ))}
      </div>
    </div>
  );
};

export default Shipping;
