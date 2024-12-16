import { useCallback } from 'react';
import usePurchaseLists from '@/lib/hooks/usePurchaseLists';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import { Wishlist as SharedWishlist } from '@shared/types/wishlist';
import { Wishlist } from '@/components/organisms/product-details/types';
import { Product } from '@/types/entity/product';

const usePDPWishlists = (product: Product) => {
  const { selectedStore } = useStoreAndBusinessUnits();

  const {
    purchaseLists: wishlists,
    createPurchaseList,
    addToWishlists: CTAddToWishlists,
    removeFromWishlists: CTRemoveFromWishlists,
  } = usePurchaseLists(selectedStore?.key);

  const addToWishlists = useCallback(
    async (wishlistIds: string[], count?: number) => {
      return await CTAddToWishlists({
        wishlistIds,
        sku: product.sku ?? '',
        count: count ?? 1,
      }).then((res) => {
        return res.data?.map((wishlist) => ({
          label: wishlist.name,
          id: wishlist.wishlistId,
        })) as Wishlist[];
      });
    },
    [CTAddToWishlists, product.sku],
  );

  const removeFromWishlists = useCallback(
    async (wishlists: { wishlistId: string; lineItemId: string }[]) => {
      return await CTRemoveFromWishlists(wishlists).then((res) => {
        return res.data?.map((wishlist) => ({
          label: wishlist.name,
          id: wishlist.wishlistId,
        })) as Wishlist[];
      });
    },
    [CTRemoveFromWishlists],
  );

  const addToNewWishlist = useCallback(
    async (wishlist: Pick<SharedWishlist, 'name' | 'description' | 'store'>, count?: number) => {
      const result = await createPurchaseList(wishlist);
      addToWishlists([result?.wishlistId ?? ''], count);
      return result;
    },
    [addToWishlists, createPurchaseList],
  );

  const getWishlists = useCallback(async (): Promise<Wishlist[] | undefined> => {
    if (selectedStore?.key) {
      const shoppingLists = wishlists?.items.map((wishlist) => ({
        lineItemId: wishlist.lineItems?.find((item) => item.productId === product.id)?.lineItemId,
        id: wishlist.wishlistId,
        label: wishlist.name,
        productIsInWishlist: !!wishlist.lineItems?.find((item) => item.productId === product.id),
      })) as Array<Wishlist>;

      return shoppingLists;
    } else return [];
  }, [selectedStore?.key, wishlists?.items, product.id]);

  return {
    addToWishlists,
    removeFromWishlists,
    addToNewWishlist,
    getWishlists,
  };
};

export default usePDPWishlists;
