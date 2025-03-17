import Typography from '@/components/atoms/typography';
import { useTranslations } from 'use-intl';
import { ShippingProps } from '../types';
import ShippingMethod from './shipping-method';

const Shipping = ({ shippingMethods, currency }: ShippingProps) => {
  const translate = useTranslations();

  return (
    <div className="grid gap-3">
      <Typography className="leading-[16px] text-gray-700" fontWeight="bold" fontSize={14}>
        {translate('common.shipping-methods')}
      </Typography>
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
