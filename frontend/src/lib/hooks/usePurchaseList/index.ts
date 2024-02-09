import { useCallback } from 'react';
import { sdk } from '@/sdk';
import useSWR, { useSWRConfig } from 'swr';
import { Wishlist } from '@shared/types/wishlist';
import usePurchaseLists from '../usePurchaseLists';

const usePurchaseList = (id?: string) => {
  const response = useSWR(['/action/wishlist/getWishlist', id], () =>
    sdk.composableCommerce.wishlist.getWishlist({ wishlistId: id }),
  );

  const { mutate } = useSWRConfig();

  const { mutateAll } = usePurchaseLists();

  const purchaseList = response.data?.isError ? undefined : response.data?.data;

  const addItem = useCallback(
    async ({ wishlistId, sku, count }: Partial<Wishlist> & { sku: string; count: number }) => {
      const res = await sdk.composableCommerce.wishlist.addToWishlist(
        {
          variant: { sku },
          count,
        },
        { id: wishlistId },
      );

      mutateAll();

      if (!res.isError) mutate(['/action/wishlist/getWishlist', wishlistId], res, { revalidate: false });

      if (!res.isError) {
        return { data: res?.data };
      }

      return {};
    },
    [mutate, mutateAll],
  );

  const updateItem = useCallback(
    async ({ wishlistId, lineItemId, count }: Partial<Wishlist> & { lineItemId: string; count: number }) => {
      const res = await sdk.composableCommerce.wishlist.updateItem(
        {
          lineItem: { id: lineItemId },
          count,
        },
        { id: wishlistId },
      );

      mutateAll();

      if (!res.isError) mutate(['/action/wishlist/getWishlist', wishlistId], res, { revalidate: false });

      if (!res.isError) {
        return { data: res?.data };
      }

      return {};
    },
    [mutate, mutateAll],
  );

  const removeItem = useCallback(
    async ({ wishlistId, lineItemId }: Partial<Wishlist> & { lineItemId: string }) => {
      const res = await sdk.composableCommerce.wishlist.removeItem(
        { lineItem: { id: lineItemId } },
        { id: wishlistId },
      );

      mutateAll();

      if (!res.isError) mutate(['/action/wishlist/getWishlist', wishlistId], res, { revalidate: false });

      return res.isError ? null : res.data;
    },
    [mutate, mutateAll],
  );

  return { purchaseList, addItem, updateItem, removeItem };
};

export default usePurchaseList;
