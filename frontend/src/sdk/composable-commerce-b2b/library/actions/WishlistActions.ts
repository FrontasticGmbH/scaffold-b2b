import { SDK, ServerOptions } from '@commercetools/frontend-sdk';
import { ComposableCommerceEventsB2B } from '../../types/events/ComposableCommerceEventsB2B';
import {
  AddToWishlistPayload,
  AddToWishlistsPayload,
  CreateWishlistPayload,
  RemoveFromWishlistPayload,
  RemoveFromWishlistsPayload,
  UpdateWishlistItemPayload,
  UpdateWishlistPayload,
} from '../../types/payloads/WishlistPayloads';
import {
  AddToWishlistQuery,
  CreateWishlistQuery,
  DeleteWishlistQuery,
  GetWishlistQuery,
  QueryWishlistsQuery,
  RemoveFromWishlistQuery,
  UpdateWishlistItemQuery,
  UpdateWishlistQuery,
} from '../../types/queries/WishlistQueries';
import {
  AddToWishlistAction,
  AddToWishlistsAction,
  CreateWishlistAction,
  DeleteWishlistAction,
  GetWishlistAction,
  QueryWishlistsAction,
  RemoveFromWishlistAction,
  RemoveFromWishlistsAction,
  UpdateWishlistAction,
  UpdateWishlistItemAction,
} from '../../types/actions/WishlistActions';
import { Wishlist } from '@shared/types/wishlist';
import { PaginatedResult } from '@shared/types/result';

export type WishlistActions = {
  createWishlist: CreateWishlistAction;
  getWishlist: GetWishlistAction;
  queryWishlists: QueryWishlistsAction;
  updateWishlist: UpdateWishlistAction;
  deleteWishlist: DeleteWishlistAction;
  addToWishlist: AddToWishlistAction;
  addToWishlists: AddToWishlistsAction;
  updateItem: UpdateWishlistItemAction;
  removeItem: RemoveFromWishlistAction;
  removeItems: RemoveFromWishlistsAction;
};

export const getWishlistActions = (sdk: SDK<ComposableCommerceEventsB2B>): WishlistActions => {
  return {
    createWishlist: async (
      payload: CreateWishlistPayload,
      query?: CreateWishlistQuery,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Wishlist>({
        actionName: 'wishlist/createWishlist',
        payload,
        query,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    getWishlist: async (
      query?: GetWishlistQuery,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Wishlist>({
        actionName: 'wishlist/getWishlist',
        query,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    queryWishlists: async (
      query: QueryWishlistsQuery,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<PaginatedResult<Wishlist>>({
        actionName: 'wishlist/queryWishlists',
        query,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    updateWishlist: async (
      payload: UpdateWishlistPayload,
      query?: UpdateWishlistQuery,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Wishlist>({
        actionName: 'wishlist/updateWishlist',
        payload,
        query,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    deleteWishlist: async (
      query?: DeleteWishlistQuery,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<void>({
        actionName: 'wishlist/deleteWishlist',
        query,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    addToWishlist: async (
      payload: AddToWishlistPayload,
      query?: AddToWishlistQuery,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Wishlist>({
        actionName: 'wishlist/addToWishlist',
        payload,
        query,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    addToWishlists: async (
      payload: AddToWishlistsPayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Wishlist[]>({
        actionName: 'wishlist/addToWishlists',
        payload,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    updateItem: async (
      payload: UpdateWishlistItemPayload,
      query?: UpdateWishlistItemQuery,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Wishlist>({
        actionName: 'wishlist/updateLineItemCount',
        payload,
        query,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    removeItem: async (
      payload: RemoveFromWishlistPayload,
      query?: RemoveFromWishlistQuery,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Wishlist>({
        actionName: 'wishlist/removeLineItem',
        payload,
        query,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },

    removeItems: async (
      payload: RemoveFromWishlistsPayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Wishlist[]>({
        actionName: 'wishlist/removeLineItems',
        payload,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
  };
};
