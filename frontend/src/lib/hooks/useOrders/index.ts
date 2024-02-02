import { useCallback } from 'react';
import { sdk } from '@/sdk';
import useSWR, { useSWRConfig } from 'swr';
import { Result } from '@shared/types/quote/Result';
import { Order } from '@shared/types/cart/Order';
import { Options } from './types';

const useOrders = ({ cursor, limit, states, ids, createdFrom, createdTo }: Options, businessUnitKey?: string) => {
  const { mutate: globalMutate } = useSWRConfig();

  const ordersResponse = useSWR(
    ['/action/cart/queryOrders', limit, cursor, ids, states, createdFrom, createdTo],
    () =>
      sdk.composableCommerce.cart.queryOrders({
        ...(limit ? { limit } : {}),
        ...(cursor ? { cursor } : {}),
        ...(ids ? { orderNumbers: ids } : {}),
        ...(states ? { orderStates: states } : {}),
        ...(createdFrom ? { createdFrom } : {}),
        ...(createdTo ? { createdTo } : {}),
      }),
    { revalidateIfStale: true },
  );

  const mutateAll = useCallback(() => {
    globalMutate((key) => typeof key === 'object' && key?.[0] === '/action/cart/queryOrders');
  }, [globalMutate]);

  const orders = ordersResponse.data?.isError
    ? ({} as Partial<Result & { items: Order[] }>)
    : ordersResponse.data?.data ?? ({} as Partial<Result & { items: Order[] }>);

  const cancelOrder = useCallback(
    async (order: Order) => {
      const response = await sdk.callAction({
        actionName: 'cart/cancelOrder',
        payload: { orderId: order.orderNumber, businessUnitKey },
      });

      mutateAll();

      return (response.isError ? {} : response.data) as Order;
    },
    [businessUnitKey, mutateAll],
  );

  const replicateOrder = useCallback(
    async (orderId: string) => {
      const response = await sdk.callAction({
        actionName: 'cart/replicateCart',
        payload: { orderId, businessUnitKey },
      });

      mutateAll();

      return (response.isError ? {} : response.data) as Order;
    },
    [businessUnitKey, mutateAll],
  );

  return { orders, cancelOrder, replicateOrder };
};

export default useOrders;
