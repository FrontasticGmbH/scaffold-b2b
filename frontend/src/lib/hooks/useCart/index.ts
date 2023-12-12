import { useCallback } from 'react';
import { Cart } from '@shared/types/cart/Cart';
import { sdk } from '@/sdk';
import useSWR from 'swr';
import { Address } from '@shared/types/account/Address';
import { QuoteRequest } from '@shared/types/quote/QuoteRequest';
import { calculateTransaction } from './utils';

const useCart = (businessUnitKey?: string, storeKey?: string) => {
  const getCart = useCallback(async () => {
    const result = await sdk.callAction<Cart>({
      actionName: `cart/getCart`,
      query: { businessUnitKey: businessUnitKey as string, storeKey: storeKey as string },
    });

    return result.isError ? ({} as Cart) : result.data;
  }, [businessUnitKey, storeKey]);

  const { data, mutate } = useSWR(['/action/cart/getCart', businessUnitKey, storeKey], getCart);

  const addItem = useCallback(
    async (lineItems: Array<{ sku: string; count: number }>) => {
      const payload = { lineItems: lineItems.map(({ sku, count }) => ({ variant: { sku }, count })), businessUnitKey };

      const result = await sdk.callAction<Cart>({
        actionName: 'cart/addToCart',
        payload,
        query: { businessUnitKey: businessUnitKey as string, storeKey: storeKey as string },
      });

      mutate();

      return result.isError ? {} : result.data;
    },
    [mutate, businessUnitKey, storeKey],
  );

  const updateItem = useCallback(
    async (lineItem: { id: string; count: number }) => {
      const payload = { lineItem, businessUnitKey };

      const result = await sdk.callAction<Cart>({
        actionName: 'cart/updateLineItem',
        payload,
        query: { businessUnitKey: businessUnitKey as string, storeKey: storeKey as string },
      });

      mutate();

      return result.isError ? {} : result.data;
    },
    [mutate, businessUnitKey, storeKey],
  );

  const removeItem = useCallback(
    async (lineItemId: string) => {
      const payload = { lineItem: { id: lineItemId }, businessUnitKey };

      const result = await sdk.callAction<Cart>({
        actionName: 'cart/removeLineItem',
        payload,
        query: { businessUnitKey: businessUnitKey as string, storeKey: storeKey as string },
      });

      mutate();

      return result.isError ? {} : result.data;
    },
    [mutate, businessUnitKey, storeKey],
  );

  const requestQuote = useCallback(
    async (payload: { buyerComment: string }) => {
      const result = await sdk.callAction<QuoteRequest>({
        actionName: 'quote/createQuoteRequest',
        payload,
        query: { businessUnitKey: businessUnitKey as string, storeKey: storeKey as string },
      });

      mutate();

      return result.isError ? {} : result.data;
    },
    [mutate, businessUnitKey, storeKey],
  );

  const updateCart = useCallback(
    async ({ shipping, billing, email }: { shipping?: Address; billing?: Address; email?: string }) => {
      const result = await sdk.callAction<Cart>({
        actionName: 'cart/updateCart',
        payload: { shipping, billing, account: { email } },
        query: { businessUnitKey: businessUnitKey as string, storeKey: storeKey as string },
      });

      mutate();

      return result.isError ? {} : result.data;
    },
    [mutate, businessUnitKey, storeKey],
  );

  return {
    cart: data ? { ...data, transaction: calculateTransaction(data) } : undefined,
    totalItems: data?.lineItems?.reduce((acc, curr) => acc + (curr.count ?? 1), 0) ?? 0,
    addItem,
    updateItem,
    removeItem,
    requestQuote,
    updateCart,
  };
};

export default useCart;
