import { SDKResponse, ServerOptions } from '@commercetools/frontend-sdk';
import { Quote, QuoteRequest } from '@shared/types/quote';
import { PaginatedResult } from '@shared/types/result';
import { CreateQuotePayload, RenegotiateQuotePayload } from '../payloads/QuotePayloads';
import {
  CreateQuoteQuery,
  AcceptQuoteQuery,
  QuoteQueryQuery,
  QuoteRequestsQueryQuery,
  DeclineQuoteQuery,
  RenegotiateQuoteQuery,
  CancelQuoteQuery,
} from '../queries/QuoteQueries';

type CreateQuoteAction = (
  payload: CreateQuotePayload,
  query: CreateQuoteQuery,
  options?: {
    /**
     * @param {boolean} [options.skipQueue] - An optional boolean, default false. Indicates whether or not to skip the action queue on the coFE base SDK and execute fully asyncronously. May cause race conditions if used incorrectly.
     */
    skipQueue?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<QuoteRequest>>;

type QuoteQueryAction = (
  query: QuoteQueryQuery,
  options?: {
    /**
     * @param {boolean} [options.skipQueue] - An optional boolean, default false. Indicates whether or not to skip the action queue on the coFE base SDK and execute fully asyncronously. May cause race conditions if used incorrectly.
     */
    skipQueue?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<PaginatedResult<Quote>>>;

type QuoteRequestsQueryAction = (
  query: QuoteRequestsQueryQuery,
  options?: {
    /**
     * @param {boolean} [options.skipQueue] - An optional boolean, default false. Indicates whether or not to skip the action queue on the coFE base SDK and execute fully asyncronously. May cause race conditions if used incorrectly.
     */
    skipQueue?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<PaginatedResult<QuoteRequest>>>;

type AcceptQuoteAction = (
  query: AcceptQuoteQuery,
  options?: {
    /**
     * @param {boolean} [options.skipQueue] - An optional boolean, default false. Indicates whether or not to skip the action queue on the coFE base SDK and execute fully asyncronously. May cause race conditions if used incorrectly.
     */
    skipQueue?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Quote>>;

type DeclineQuoteAction = (
  query: DeclineQuoteQuery,
  options?: {
    /**
     * @param {boolean} [options.skipQueue] - An optional boolean, default false. Indicates whether or not to skip the action queue on the coFE base SDK and execute fully asyncronously. May cause race conditions if used incorrectly.
     */
    skipQueue?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Quote>>;

type RenegotiateQuoteAction = (
  payload: RenegotiateQuotePayload,
  query: RenegotiateQuoteQuery,
  options?: {
    /**
     * @param {boolean} [options.skipQueue] - An optional boolean, default false. Indicates whether or not to skip the action queue on the coFE base SDK and execute fully asyncronously. May cause race conditions if used incorrectly.
     */
    skipQueue?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Quote>>;

type CancelQuoteAction = (
  query: CancelQuoteQuery,
  options?: {
    /**
     * @param {boolean} [options.skipQueue] - An optional boolean, default false. Indicates whether or not to skip the action queue on the coFE base SDK and execute fully asyncronously. May cause race conditions if used incorrectly.
     */
    skipQueue?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<QuoteRequest>>;

export {
  type CreateQuoteAction,
  type QuoteQueryAction,
  type QuoteRequestsQueryAction,
  type AcceptQuoteAction,
  type DeclineQuoteAction,
  type RenegotiateQuoteAction,
  type CancelQuoteAction,
};
