import { useCallback } from 'react';
import { sdk } from '@/sdk';
import useSWR from 'swr';
import { Wishlist } from '@shared/types/wishlist/Wishlist';

const usePurchaseLists = (storeKey?: string) => {
  const response = useSWR(['/action/wishlist/', storeKey], () =>
    sdk.composableCommerce.wishlist.getWishlists({ storeKey: storeKey ?? '' }),
  );

  const { mutate } = response;

  const createPurchaseList = useCallback(
    async ({ name, description, store }: Wishlist) => {
      const res = await sdk.composableCommerce.wishlist.createWishlist(
        { name, description },
        { storeKey: store?.key ?? '' },
      );

      mutate();

      return res.isError ? null : res.data;
    },
    [mutate],
  );

  const updatePurchaseList = useCallback(
    async ({ wishlistId, name, description }: Partial<Wishlist>) => {
      const res = await sdk.composableCommerce.wishlist.updateWishlist({ name, description }, { id: wishlistId });

      mutate();

      return res.isError ? null : res.data;
    },
    [mutate],
  );

  const deletePurchaseList = useCallback(
    async ({ wishlistId, store }: Partial<Wishlist>) => {
      const res = await sdk.callAction({
        actionName: `wishlist/deleteWishlist?id=${wishlistId}&storeKey=${store?.key ?? ''}`,
      });

      mutate();

      return res.isError ? null : res.data;
    },
    [mutate],
  );

  const removeItem = useCallback(
    async ({ wishlistId, lineItemId }: Partial<Wishlist> & { lineItemId: string }) => {
      const res = await sdk.composableCommerce.wishlist.removeItem(
        { lineItem: { id: lineItemId } },
        { id: wishlistId },
      );

      mutate();

      return res.isError ? null : res.data;
    },
    [mutate],
  );

  const addItem = useCallback(
    async ({ wishlistId, sku, count }: Partial<Wishlist> & { sku: string; count: number }) => {
      const result = await sdk.composableCommerce.wishlist.addItem(
        {
          variant: { sku },
          count,
        },
        { id: wishlistId },
      );

      mutate();

      if (!result.isError) {
        return { data: result?.data };
      }

      return {};
    },
    [mutate],
  );

  return {
    purchaseLists: response.data?.isError ? [] : response.data?.data ?? [],
    createPurchaseList,
    updatePurchaseList,
    deletePurchaseList,
    removeItem,
    addItem,
  };
};

export default usePurchaseLists;
