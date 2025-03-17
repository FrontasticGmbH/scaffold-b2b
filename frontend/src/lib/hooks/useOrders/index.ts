import { useCallback } from 'react';
import { sdk } from '@/sdk';
import useSWR, { useSWRConfig } from 'swr';
import { Order } from '@shared/types/cart/Order';
import { PaginatedResult } from '@shared/types/result';
import { Options } from './types';

const useOrders = ({
  cursor,
  limit,
  states,
  ids,
  businessUnitKey,
  createdFrom,
  createdTo,
  sortAttributes,
}: Options) => {
  const { mutate: globalMutate } = useSWRConfig();

  const ordersResponse = useSWR(
    !businessUnitKey
      ? null
      : [
          '/action/cart/queryOrders',
          limit,
          cursor,
          ids,
          states,
          createdFrom,
          createdTo,
          businessUnitKey,
          sortAttributes,
        ],
    () =>
      sdk.composableCommerce.cart.queryOrders({
        ...(limit ? { limit } : {}),
        ...(cursor ? { cursor } : {}),
        ...(ids ? { orderNumbers: ids } : {}),
        ...(states ? { orderStates: states } : {}),
        ...(createdFrom ? { createdFrom } : {}),
        ...(createdTo ? { createdTo } : {}),
        ...(businessUnitKey ? { businessUnitKey } : {}),
        ...(sortAttributes ? { sortAttributes } : ''),
      }),
    { revalidateIfStale: true },
  );

  const isLoading = !businessUnitKey || ordersResponse.isLoading;

  const mutateAll = useCallback(() => {
    globalMutate((key) => typeof key === 'object' && key?.[0] === '/action/cart/queryOrders');
  }, [globalMutate]);

  const orders = ordersResponse.data?.isError
    ? ({} as Partial<PaginatedResult<Order>>)
    : (ordersResponse.data?.data ?? ({} as Partial<PaginatedResult<Order>>));

  const cancelOrder = useCallback(
    async (order: Order) => {
      if (!order.orderId || !businessUnitKey) return {} as Order;

      const response = await sdk.composableCommerce.cart.cancelOrder(
        {
          orderId: order.orderId,
        },
        { businessUnitKey },
      );

      mutateAll();

      return (response.isError ? {} : response.data) as Order;
    },
    [businessUnitKey, mutateAll],
  );

  const replicateOrder = useCallback(
    async (orderId: string) => {
      const response = await sdk.composableCommerce.cart.replicateOrder({ orderId }, { businessUnitKey });

      mutateAll();

      return (response.isError ? {} : response.data) as Order;
    },
    [businessUnitKey, mutateAll],
  );

  return { orders, isLoading, cancelOrder, replicateOrder };
};

export default useOrders;
