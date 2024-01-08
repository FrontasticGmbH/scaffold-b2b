type CreateWishlistPayload = {
	name?: string;
	description?: string;
};

type UpdateWishlistPayload = {
	name?: string;
	description?: string;
};

type AddToWishlistPayload = {
	variant: { sku: string };
	count?: number;
};

type UpdateWishlistItemPayload = {
	lineItem: { id: string };
	count: number;
};

type RemoveFromWishlistPayload = {
	lineItem: { id: string };
};

export {
	type CreateWishlistPayload,
	type UpdateWishlistPayload,
	type AddToWishlistPayload,
	type UpdateWishlistItemPayload,
	type RemoveFromWishlistPayload,
};
