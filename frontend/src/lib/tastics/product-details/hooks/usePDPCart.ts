import { useCallback, useMemo } from 'react';
import { getLocalizationInfo } from '@/project.config';
import { ShippingRate } from '@shared/types/cart';
import useCart from '@/lib/hooks/useCart';
import { useShipAndLanguage } from '@/providers/ship-and-language';
import { ShippingMethod } from '@/components/organisms/product-details/types';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import { Product } from '@/types/entity/product';

const usePDPCart = (product: Product) => {
  const { selectedLocation } = useShipAndLanguage();
  const { selectedBusinessUnit, selectedStore } = useStoreAndBusinessUnits();
  const { addItem, shippingMethods } = useCart(selectedBusinessUnit?.key, selectedStore?.key);

  const getShippingPrice = useCallback(
    (rates: Array<ShippingRate>): number => {
      const { countries } = getLocalizationInfo(selectedLocation?.languages?.[0]?.value ?? 'en-us');

      const currentRate = rates?.find((rate) => !!countries.find((c) => c.toLowerCase() === rate.name?.toLowerCase()));
      return (currentRate?.price?.centAmount ?? 1000) / 100;
    },
    [selectedLocation],
  );

  const mappedShippingMethods = useMemo(() => {
    const mappedShippingMethods =
      (shippingMethods?.map((method) => ({
        label: method.name ?? '',
        price: getShippingPrice(method.rates ?? []),
        estimatedDeliveryDays: parseInt(method.description ?? '3'),
      })) as Array<ShippingMethod>) ?? [];

    return mappedShippingMethods;
  }, [getShippingPrice, shippingMethods]);

  const addToCart = useCallback(
    async (count: number) => {
      await addItem([{ sku: product.sku ?? '', count }]);
    },
    [addItem, product.sku],
  );

  return {
    addToCart,
    shippingMethods: mappedShippingMethods,
  };
};

export default usePDPCart;
