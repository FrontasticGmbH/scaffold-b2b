import { SDKResponse, ServerOptions } from '@commercetools/frontend-sdk';
import { PaginatedResult } from '@shared/types/result';
import { Wishlist } from '@shared/types/wishlist';
import {
  AddToWishlistPayload,
  AddToWishlistsPayload,
  CreateWishlistPayload,
  RemoveFromWishlistPayload,
  RemoveFromWishlistsPayload,
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
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Wishlist>>;

type GetWishlistAction = (
  query?: GetWishlistQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Wishlist>>;

type QueryWishlistsAction = (
  query: QueryWishlistsQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<PaginatedResult<Wishlist>>>;

type UpdateWishlistAction = (
  payload: UpdateWishlistPayload,
  query?: UpdateWishlistQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Wishlist>>;

type DeleteWishlistAction = (
  query?: DeleteWishlistQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<void>>;

type AddToWishlistAction = (
  payload: AddToWishlistPayload,
  query?: AddToWishlistQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Wishlist>>;

type AddToWishlistsAction = (
  payload: AddToWishlistsPayload,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Wishlist[]>>;

type UpdateWishlistItemAction = (
  payload: UpdateWishlistItemPayload,
  query?: UpdateWishlistItemQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Wishlist>>;

type RemoveFromWishlistAction = (
  payload: RemoveFromWishlistPayload,
  query?: RemoveFromWishlistQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Wishlist>>;

type RemoveFromWishlistsAction = (
  payload: RemoveFromWishlistsPayload,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Wishlist[]>>;

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
  type RemoveFromWishlistsAction,
};
