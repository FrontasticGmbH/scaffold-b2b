import { sdk } from '@/sdk';
import useSWR from 'swr';

const usePurchaseList = (id?: string) => {
  const result = useSWR(['/action/wishlist/getWishlist', id], () =>
    sdk.composableCommerce.wishlist.getWishlist({ wishlistId: id }),
  );

  const purchaseList = result.data?.isError ? undefined : result.data?.data;

  return { purchaseList };
};

export default usePurchaseList;
