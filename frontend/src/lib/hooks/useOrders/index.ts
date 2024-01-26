import { sdk } from '@/sdk';
import useSWR from 'swr';
import { Result } from '@shared/types/quote/Result';
import { Order, ShipmentState, OrderState } from '@shared/types/cart/Order';
import { Options } from './types';

const useOrders = ({ cursor, limit, states, ids }: Options) => {
  const orderStates = states?.filter((state) => state !== 'Delivered' && state != 'Returned');
  const shipmentSate = states?.filter((state) => state === 'Delivered');

  const ordersResponse = useSWR(['/action/cart/queryOrders', limit, cursor, ids, orderStates, shipmentSate], () =>
    sdk.composableCommerce.cart.queryOrders({
      ...(limit ? { limit } : {}),
      ...(cursor ? { cursor } : {}),
      ...(ids ? { orderIds: ids } : {}),
      ...(shipmentSate ? { shipmentStates: shipmentSate as ShipmentState[] } : {}),
      ...(orderStates ? { orderStates: orderStates as OrderState[] } : {}),
    }),
  );

  const orders = ordersResponse.data?.isError
    ? ({} as Partial<Result & { items: Order[] }>)
    : ordersResponse.data?.data ?? ({} as Partial<Result & { items: Order[] }>);

  return { orders };
};

export default useOrders;
