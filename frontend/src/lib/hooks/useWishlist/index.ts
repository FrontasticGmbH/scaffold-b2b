import { sdk } from '@/sdk';
import { mutate } from 'swr';

const useWishlist = () => {
  const getWishlist = async (id: string) => {
    const result = await sdk.composableCommerce.wishlist.getWishlist({ wishlistId: id });

    if (!result.isError) {
      mutate('/action/wishlist/fetchWishlist');
      return { data: result?.data };
    }

    return {};
  };

  const getWishlists = async (storeKey: string) => {
    const result = await sdk.composableCommerce.wishlist.getWishlists({ storeKey });

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
