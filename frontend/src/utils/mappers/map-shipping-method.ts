import { ShippingMethod } from '@shared/types/cart';
import { ShippingMethod as EntityShippingMethod } from '@/types/entity/shipping-method';
import { Currency } from '@/types/currency';

export const mapShippingMethod = (shippingMethod: ShippingMethod): EntityShippingMethod => {
  const estimatedDays = 7;

  const estimatedDeliveryDate = new Date(Date.now());

  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + estimatedDays);

  const [days, months, year] = [
    estimatedDeliveryDate.getDate(),
    estimatedDeliveryDate.getMonth() + 1,
    estimatedDeliveryDate.getFullYear(),
  ];

  const defaultRate = shippingMethod.rates?.[0];

  return {
    id: shippingMethod.shippingMethodId,
    name: shippingMethod.name ?? '',
    description: shippingMethod.description ?? '',
    price: (defaultRate?.price?.centAmount ?? 0) / Math.pow(10, defaultRate?.price?.fractionDigits ?? 2),
    currency: (defaultRate?.price?.currencyCode ?? 'USD') as Currency,
    freeAbove: defaultRate?.freeAbove?.centAmount,
    ...(Number.isNaN(estimatedDays)
      ? { estimatedDeliveryDate: 'N/A' }
      : { estimatedDeliveryDate: `${days.toString().padStart(2, '0')}-${months.toString().padStart(2, '0')}-${year}` }),
  };
};
