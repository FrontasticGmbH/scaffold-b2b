type CreateWishlistQuery = {
	storeKey?: string;
};

type GetWishlistQuery = {
	wishlistId?: string;
};

type GetWishlistsQuery = {
	storeKey?: string;
};

type UpdateWishlistQuery = {
	id?: string;
};

type ClearWishlistQuery = {
	wishlistId?: string;
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
	type GetWishlistsQuery,
	type UpdateWishlistQuery,
	type ClearWishlistQuery,
	type DeleteWishlistQuery,
	type AddToWishlistQuery,
	type UpdateWishlistItemQuery,
	type RemoveFromWishlistQuery,
};
