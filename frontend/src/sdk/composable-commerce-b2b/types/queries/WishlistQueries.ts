type CreateWishlistQuery = {
  storeKey?: string;
};

type GetWishlistQuery = {
  wishlistId?: string;
};

type QueryWishlistsQuery = {
  name?: string;
  accountId: string;
  limit?: number;
  cursor?: string;
  storeKey?: string;
  wishlistIds?: string[];
  query?: string;
};

type UpdateWishlistQuery = {
  id?: string;
};

type DeleteWishlistQuery = {
  id?: string;
  storeKey?: string;
};

type AddToWishlistQuery = {
  /*
   * Wishlist ID
   **/
  id?: string;
};

type UpdateWishlistItemQuery = {
  /*
   * Wishlist ID
   **/
  id?: string;
};

type RemoveFromWishlistQuery = {
  /*
   * Wishlist ID
   **/
  id?: string;
};

export {
  type CreateWishlistQuery,
  type GetWishlistQuery,
  type QueryWishlistsQuery,
  type UpdateWishlistQuery,
  type DeleteWishlistQuery,
  type AddToWishlistQuery,
  type UpdateWishlistItemQuery,
  type RemoveFromWishlistQuery,
};
