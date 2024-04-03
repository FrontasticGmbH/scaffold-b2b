import { SDKResponse, ServerOptions } from '@commercetools/frontend-sdk';
import { PaginatedResult } from '@shared/types/result';
import { Wishlist } from '@shared/types/wishlist';
import {
  AddToWishlistPayload,
  AddToWishlistsPayload,
  CreateWishlistPayload,
  RemoveFromWishlistPayload,
  UpdateWishlistItemPayload,
  UpdateWishlistPayload,
} from '../payloads/WishlistPayloads';
import {
  AddToWishlistQuery,
  CreateWishlistQuery,
  DeleteWishlistQuery,
  GetWishlistQuery,
  QueryWishlistsQuery,
  RemoveFromWishlistQuery,
  UpdateWishlistItemQuery,
  UpdateWishlistQuery,
} from '../queries/WishlistQueries';

type CreateWishlistAction = (
  payload: CreateWishlistPayload,
  query?: CreateWishlistQuery,
  options?: {
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Wishlist>>;

type GetWishlistAction = (
  query?: GetWishlistQuery,
  options?: {
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Wishlist>>;

type QueryWishlistsAction = (
  query: QueryWishlistsQuery,
  options?: {
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<PaginatedResult<Wishlist>>>;

type UpdateWishlistAction = (
  payload: UpdateWishlistPayload,
  query?: UpdateWishlistQuery,
  options?: {
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Wishlist>>;

type DeleteWishlistAction = (
  query?: DeleteWishlistQuery,
  options?: {
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<void>>;

type AddToWishlistAction = (
  payload: AddToWishlistPayload,
  query?: AddToWishlistQuery,
  options?: {
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Wishlist>>;

type AddToWishlistsAction = (
  payload: AddToWishlistsPayload,
  options?: {
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Wishlist[]>>;

type UpdateWishlistItemAction = (
  payload: UpdateWishlistItemPayload,
  query?: UpdateWishlistItemQuery,
  options?: {
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Wishlist>>;

type RemoveFromWishlistAction = (
  payload: RemoveFromWishlistPayload,
  query?: RemoveFromWishlistQuery,
  options?: {
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Wishlist>>;

export {
  type CreateWishlistAction,
  type GetWishlistAction,
  type QueryWishlistsAction,
  type UpdateWishlistAction,
  type DeleteWishlistAction,
  type AddToWishlistAction,
  type AddToWishlistsAction,
  type UpdateWishlistItemAction,
  type RemoveFromWishlistAction,
};
