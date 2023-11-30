import { sdk } from '@/sdk';
import { Wishlist } from '@shared/types/wishlist/Wishlist';
import { mutate } from 'swr';

const useWishlist = () => {
  const getWishlist = async (id: string) => {
    const result = await sdk.callAction<Wishlist>({
      actionName: `wishlist/fetchWishlist?id=${id}`,
    });

    if (!result.isError) {
      mutate('/action/wishlist/fetchWishlist');
      return { data: result?.data };
    }

    return {};
  };

  const getWishlists = async (storeKey: string) => {
    const result = await sdk.callAction<Wishlist[]>({
      actionName: `wishlist/getWishlists?storeKey=${storeKey}`,
    });

    if (!result.isError) {
      mutate('/action/wishlist/getWishlists');
      return { data: result?.data };
    }

    return {};
  };

  return {
    getWishlist,
    getWishlists,
  };
};

export default useWishlist;
