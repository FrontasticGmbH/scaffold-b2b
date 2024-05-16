import { useCallback } from 'react';
import { sdk } from '@/sdk';
import useSWR, { useSWRConfig } from 'swr';
import { Wishlist } from '@shared/types/wishlist/Wishlist';
import useAccount from '../useAccount';

const usePurchaseLists = (storeKey?: string, skipQueue?: boolean) => {
  const { mutate: globalMutate } = useSWRConfig();

  const account = useAccount();

  const response = useSWR(storeKey && account.account?.accountId ? ['/action/wishlist/', storeKey] : null, () =>
    sdk.composableCommerce.wishlist.queryWishlists(
      {
        accountId: account.account?.accountId ?? '',
        storeKey: storeKey ?? '',
      },
      { skipQueue },
    ),
  );

  const { mutate } = response;

  const mutateAll = useCallback(() => {
    globalMutate((key) => typeof key === 'object' && key?.[0] === '/action/wishlist/');
  }, [globalMutate]);

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

  const addToWishlists = useCallback(
    async ({ wishlistIds, sku, count }: { wishlistIds: string[]; sku: string; count: number }) => {
      const result = await sdk.callAction<Wishlist[]>({
        actionName: 'wishlist/addToWishlists',
        payload: {
          wishlistIds,
          variant: { sku },
          count,
        },
      });

      mutate();

      if (!result.isError) {
        return { data: result?.data };
      }

      return {};
    },
    [mutate],
  );

  const removeFromWishlists = useCallback(
    async (
      wishlists: {
        lineItemId: string;
        wishlistId: string;
      }[],
    ) => {
      const result = await sdk.callAction<Wishlist[]>({
        actionName: 'wishlist/removeLineItems',
        payload: wishlists,
      });

      mutate();

      if (!result.isError) {
        return { data: result?.data };
      }

      return {};
    },
    [mutate],
  );

  return {
    purchaseLists: response.data?.isError ? null : response.data?.data ?? null,
    mutateAll,
    createPurchaseList,
    updatePurchaseList,
    deletePurchaseList,
    addToWishlists,
    removeFromWishlists,
  };
};

export default usePurchaseLists;
