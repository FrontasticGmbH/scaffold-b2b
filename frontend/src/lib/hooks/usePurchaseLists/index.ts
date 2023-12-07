import { useCallback } from 'react';
import { sdk } from '@/sdk';
import useSWR from 'swr';
import { Wishlist } from '@shared/types/wishlist/Wishlist';
import useStores from '../useStores';

const usePurchaseLists = () => {
  const { defaultStore } = useStores();

  const response = useSWR(['/action/wishlist/', defaultStore?.key], () =>
    sdk.composableCommerce.wishlist.getWishlists({ storeKey: defaultStore?.key ?? '' }),
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

  return {
    purchaseLists: response.data?.isError ? [] : response.data?.data ?? [],
    createPurchaseList,
    updatePurchaseList,
    deletePurchaseList,
  };
};

export default usePurchaseLists;
