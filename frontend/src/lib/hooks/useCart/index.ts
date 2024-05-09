import { useCallback } from 'react';
import { Cart } from '@shared/types/cart/Cart';
import { sdk } from '@/sdk';
import useSWR from 'swr';
import { Address } from '@shared/types/account/Address';
import { Order } from '@shared/types/cart';
import { calculateTransaction } from '@/lib/utils/calculate-transaction';
import { CheckoutPayload, QuoteRequestPayload } from './types';

const useCart = (businessUnitKey?: string, storeKey?: string) => {
  const getCart = useCallback(async () => {
    const result = await sdk.composableCommerce.cart.getCart({
      businessUnitKey: businessUnitKey as string,
      storeKey: storeKey as string,
    });

    return result.isError ? ({} as Cart) : result.data;
  }, [businessUnitKey, storeKey]);

  const { data, mutate } = useSWR(
    !(businessUnitKey && storeKey) ? null : ['/action/cart/getCart', businessUnitKey, storeKey],
    getCart,
  );

  const isQuotationCart = data?.origin === 'Quote';

  const addItem = useCallback(
    async (lineItems: Array<{ sku: string; count: number }>) => {
      const payload = { lineItems: lineItems.map(({ sku, count }) => ({ variant: { sku }, count })), businessUnitKey };

      const result = await sdk.composableCommerce.cart.addItem(payload, {
        businessUnitKey: businessUnitKey as string,
        storeKey: storeKey as string,
      });

      if (!result.isError) mutate(result.data, { revalidate: false });

      return result.isError ? { success: false, message: result.error.message } : { ...result.data, success: true };
    },
    [mutate, businessUnitKey, storeKey],
  );

  const updateItem = useCallback(
    async (lineItem: { id: string; count: number }) => {
      const payload = { lineItem, businessUnitKey };

      const result = await sdk.composableCommerce.cart.updateItem(payload, {
        businessUnitKey: businessUnitKey as string,
        storeKey: storeKey as string,
      });

      if (!result.isError) mutate(result.data, { revalidate: false });

      return result.isError ? {} : result.data;
    },
    [mutate, businessUnitKey, storeKey],
  );

  const removeItem = useCallback(
    async (lineItemId: string) => {
      const payload = { lineItem: { id: lineItemId }, businessUnitKey };

      const result = await sdk.composableCommerce.cart.removeItem(payload, {
        businessUnitKey: businessUnitKey as string,
        storeKey: storeKey as string,
      });

      if (!result.isError) mutate(result.data, { revalidate: false });

      return result.isError ? {} : result.data;
    },
    [mutate, businessUnitKey, storeKey],
  );

  const requestQuote = useCallback(
    async (payload: QuoteRequestPayload) => {
      const result = await sdk.composableCommerce.quote.createQuote(
        { comment: payload.buyerComment, purchaseOrderNumber: payload.purchaseOrderNumber },
        { businessUnitKey: businessUnitKey as string, storeKey: storeKey as string },
      );

      mutate();

      return result.isError ? {} : result.data;
    },
    [mutate, businessUnitKey, storeKey],
  );

  const updateCart = useCallback(
    async ({ shipping, billing, email }: { shipping?: Address; billing?: Address; email?: string }) => {
      const result = await sdk.composableCommerce.cart.updateCart(
        { shipping, billing, ...(email ? { account: { email } } : {}) },
        { businessUnitKey: businessUnitKey as string, storeKey: storeKey as string },
      );

      if (!result.isError) mutate(result.data, { revalidate: false });

      return result.isError ? { success: false, error: result.error } : { ...result.data, success: true };
    },
    [mutate, businessUnitKey, storeKey],
  );

  const redeemDiscount = useCallback(
    async (code: string) => {
      const result = await sdk.composableCommerce.cart.redeemDiscountCode(
        { code },
        { businessUnitKey: businessUnitKey as string, storeKey: storeKey as string },
      );

      if (!result.isError) mutate(result.data, { revalidate: false });

      return result.isError ? ({} as Partial<Cart>) : result.data;
    },
    [mutate, businessUnitKey, storeKey],
  );

  const removeDiscount = useCallback(
    async (discountId: string) => {
      const result = await sdk.composableCommerce.cart.removeDiscountCode(
        { discountId },
        { businessUnitKey: businessUnitKey as string, storeKey: storeKey as string },
      );

      if (!result.isError) mutate(result.data, { revalidate: false });

      return result.isError ? ({} as Partial<Cart>) : result.data;
    },
    [mutate, businessUnitKey, storeKey],
  );

  const clearCart = useCallback(async () => {
    await sdk.composableCommerce.cart.clearCart();

    mutate();
  }, [mutate]);

  const checkout = useCallback(
    async ({ purchaseOrderNumber }: CheckoutPayload) => {
      const result = await sdk.composableCommerce.cart.checkout(
        { purchaseOrderNumber },
        { businessUnitKey: businessUnitKey as string, storeKey: storeKey as string },
      );

      mutate();

      return result.isError ? ({} as Partial<Order>) : result.data;
    },
    [mutate, businessUnitKey, storeKey],
  );

  const getShippingMethods = useCallback(async () => {
    const result = await sdk.composableCommerce.cart.getShippingMethods({
      businessUnitKey,
      storeKey,
      onlyMatching: true,
    });

    return result.isError ? [] : result.data;
  }, [businessUnitKey, storeKey]);

  const { data: shippingMethods } = useSWR(
    businessUnitKey && storeKey ? ['/action/cart/getShippingMethods', businessUnitKey, storeKey] : null,
    getShippingMethods,
  );

  const setShippingMethod = useCallback(
    async (shippingMethodId: string) => {
      const result = await sdk.composableCommerce.cart.setShippingMethod(
        { shippingMethod: { id: shippingMethodId } },
        { businessUnitKey: businessUnitKey as string, storeKey: storeKey as string },
      );

      if (!result.isError) mutate(result.data, { revalidate: false });

      return result.isError ? ({} as Partial<Cart>) : result.data;
    },
    [businessUnitKey, storeKey, mutate],
  );

  return {
    cart: data ? { ...data, transaction: calculateTransaction(data) } : undefined,
    isQuotationCart,
    shippingMethods,
    totalItems: data?.lineItems?.reduce((acc, curr) => acc + (curr.count ?? 1), 0) ?? 0,
    addItem,
    updateItem,
    removeItem,
    requestQuote,
    updateCart,
    setShippingMethod,
    redeemDiscount,
    removeDiscount,
    checkout,
    clearCart,
  };
};

export default useCart;
