import { ShippingMethod } from '../types';

export const getDeliveryRange = (methods: Array<ShippingMethod>) => {
  if (methods.length === 0) return { minDeliveryDays: null, maxDeliveryDays: null };

  const { minDeliveryDays, maxDeliveryDays } = methods.reduce(
    (acc, item) => {
      acc.minDeliveryDays = Math.min(acc.minDeliveryDays, item.estimatedDeliveryDays);
      acc.maxDeliveryDays = Math.max(acc.maxDeliveryDays, item.estimatedDeliveryDays);
      return acc;
    },
    { minDeliveryDays: methods[0].estimatedDeliveryDays, maxDeliveryDays: methods[0].estimatedDeliveryDays },
  );

  return { minDeliveryDays, maxDeliveryDays };
};
