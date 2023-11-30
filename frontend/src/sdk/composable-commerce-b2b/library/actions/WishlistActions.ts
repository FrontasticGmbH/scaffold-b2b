import { SDK, ServerOptions } from "@commercetools/frontend-sdk";
import { ComposableCommerceEventsB2B } from "../../types/events/ComposableCommerceEventsB2B";
import {
	CreateWishlistPayload,
	UpdateWishlistPayload,
	AddToWishlistPayload,
	UpdateWishlistItemPayload,
	RemoveFromWishlistPayload,
} from "../../types/payloads/WishlistPayloads";
import {
	CreateWishlistQuery,
	GetWishlistQuery,
	GetWishlistsQuery,
	UpdateWishlistQuery,
	ClearWishlistQuery,
	DeleteWishlistQuery,
	AddToWishlistQuery,
	UpdateWishlistItemQuery,
	RemoveFromWishlistQuery,
} from "../../types/queries/WishlistQueries";
import {
	CreateWishlistAction,
	GetWishlistAction,
	GetWishlistsAction,
	UpdateWishlistAction,
	ClearWishlistAction,
	DeleteWishlistAction,
	AddToWishlistAction,
	UpdateWishlistItemAction,
	RemoveFromWishlistAction,
} from "../../types/actions/WishlistActions";
import { Wishlist } from "@shared/types/wishlist";

export type WishlistActions = {
	createWishlist: CreateWishlistAction;
	getWishlist: GetWishlistAction;
	getWishlists: GetWishlistsAction;
	updateWishlist: UpdateWishlistAction;
	clearWishlist: ClearWishlistAction;
	deleteWishlist: DeleteWishlistAction;
	addItem: AddToWishlistAction;
	updateItem: UpdateWishlistItemAction;
	removeItem: RemoveFromWishlistAction;
};

export const getWishlistActions = (
	sdk: SDK<ComposableCommerceEventsB2B>
): WishlistActions => {
	return {
		createWishlist: async (
			payload: CreateWishlistPayload,
			query?: CreateWishlistQuery,
			options: { serverOptions?: ServerOptions } = {}
		) => {
			const response = await sdk.callAction<Wishlist>({
				actionName: "wishlist/createWishlist",
				payload,
				query,
				serverOptions: options.serverOptions,
			});
			return response;
		},
		getWishlist: async (
			query?: GetWishlistQuery,
			options: { serverOptions?: ServerOptions } = {}
		) => {
			const response = await sdk.callAction<Wishlist>({
				actionName: "wishlist/getWishlist",
				query,
				serverOptions: options.serverOptions,
			});
			return response;
		},
		getWishlists: async (
			query?: GetWishlistsQuery,
			options: { serverOptions?: ServerOptions } = {}
		) => {
			const response = await sdk.callAction<Wishlist[]>({
				actionName: "wishlist/getWishlists",
				query,
				serverOptions: options.serverOptions,
			});
			return response;
		},
		updateWishlist: async (
			payload: UpdateWishlistPayload,
			query?: UpdateWishlistQuery,
			options: { serverOptions?: ServerOptions } = {}
		) => {
			const response = await sdk.callAction<Wishlist>({
				actionName: "wishlist/updateWishlist",
				payload,
				query,
				serverOptions: options.serverOptions,
			});
			return response;
		},
		clearWishlist: async (
			query?: ClearWishlistQuery,
			options: { serverOptions?: ServerOptions } = {}
		) => {
			const response = await sdk.callAction<void>({
				actionName: "wishlist/clearWishlist",
				query,
				serverOptions: options.serverOptions,
			});
			return response;
		},
		deleteWishlist: async (
			query?: DeleteWishlistQuery,
			options: { serverOptions?: ServerOptions } = {}
		) => {
			const response = await sdk.callAction<void>({
				actionName: "wishlist/deleteWishlist",
				query,
				serverOptions: options.serverOptions,
			});
			return response;
		},
		addItem: async (
			payload: AddToWishlistPayload,
			query?: AddToWishlistQuery,
			options: { serverOptions?: ServerOptions } = {}
		) => {
			const response = await sdk.callAction<Wishlist>({
				actionName: "wishlist/addToWishlist",
				payload,
				query,
				serverOptions: options.serverOptions,
			});
			return response;
		},
		updateItem: async (
			payload: UpdateWishlistItemPayload,
			query?: UpdateWishlistItemQuery,
			options: { serverOptions?: ServerOptions } = {}
		) => {
			const response = await sdk.callAction<Wishlist>({
				actionName: "wishlist/updateLineItemCount",
				payload,
				query,
				serverOptions: options.serverOptions,
			});
			return response;
		},
		removeItem: async (
			payload: RemoveFromWishlistPayload,
			query?: RemoveFromWishlistQuery,
			options: { serverOptions?: ServerOptions } = {}
		) => {
			const response = await sdk.callAction<Wishlist>({
				actionName: "wishlist/removeLineItem",
				payload,
				query,
				serverOptions: options.serverOptions,
			});
			return response;
		},
	};
};
