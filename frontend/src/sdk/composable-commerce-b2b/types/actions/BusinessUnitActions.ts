import { SDKResponse, ServerOptions } from '@commercetools/frontend-sdk';
import { ApprovalFlow, ApprovalRule, Associate, AssociateRole, BusinessUnit } from '@shared/types/business-unit';
import { Order } from '@shared/types/cart';
import { PaginatedResult } from '@shared/types/result';
import {
  CreateBusinessUnitPayload,
  AddAssociatePayload,
  RemoveAssociatePayload,
  UpdateAssociatePayload,
  UpdateBusinessUnitPayload,
  AddBusinessUnitAddressPayload,
  UpdateBusinessUnitAddressPayload,
  RemoveBusinessUnitAddressPayload,
  CreateApprovalRulePayload,
  UpdateApprovalRulePayload,
  ApproveApprovalFlowPayload,
  RejectApprovalFlowPayload,
} from '../payloads/BusinessUnitPayloads';
import {
  GetBusinessUnitsQuery,
  GetBusinessUnitOrdersQuery,
  GetAssociateQuery,
  AddAssociateQuery,
  RemoveAssociateQuery,
  UpdateAssociateQuery,
  AddBusinessUnitAddressQuery,
  UpdateBusinessUnitAddressQuery,
  RemoveBusinessUnitAddressQuery,
  UpdateBusinessUnitQuery,
  GetBusinessUnitQuery,
  SetBusinessUnitAndStoreKeysQuery,
  CreateApprovalRuleQuery,
  QueryApprovalRulesQuery,
  UpdateApprovalRuleQuery,
  QueryApprovalFlowsQuery,
  ApproveApprovalFlowQuery,
  RejectApprovalFlowQuery,
} from '../queries/BusinessUnitQueries';

type GetBusinessUnitAction = (
  query: GetBusinessUnitQuery,
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
) => Promise<SDKResponse<BusinessUnit>>;

type GetBusinessUnitsAction = (
  query?: GetBusinessUnitsQuery,
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
) => Promise<SDKResponse<BusinessUnit[]>>;

type CreateBusinessUnitAction = (
  payload: CreateBusinessUnitPayload,
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
) => Promise<SDKResponse<BusinessUnit>>;

type UpdateBusinessUnitAction = (
  payload: UpdateBusinessUnitPayload,
  query: UpdateBusinessUnitQuery,
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
) => Promise<SDKResponse<BusinessUnit>>;

type GetAssociateRolesAction = (options?: {
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
}) => Promise<SDKResponse<AssociateRole[]>>;

type GetAssociateAction = (
  query: GetAssociateQuery,
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
) => Promise<SDKResponse<Associate>>;

type AddAssociateAction = (
  payload: AddAssociatePayload,
  query: AddAssociateQuery,
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
) => Promise<SDKResponse<BusinessUnit>>;

type UpdateAssociateAction = (
  payload: UpdateAssociatePayload,
  query: UpdateAssociateQuery,
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
) => Promise<SDKResponse<BusinessUnit>>;

type RemoveAssociateAction = (
  payload: RemoveAssociatePayload,
  query: RemoveAssociateQuery,
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
) => Promise<SDKResponse<BusinessUnit>>;

type GetCompaniesAction = (options?: { serverOptions?: ServerOptions }) => Promise<SDKResponse<BusinessUnit[]>>;

type GetBusinessUnitOrdersAction = (
  query: GetBusinessUnitOrdersQuery,
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
) => Promise<SDKResponse<Order[]>>;

type AddBusinessUnitAddressAction = (
  payload: AddBusinessUnitAddressPayload,
  query: AddBusinessUnitAddressQuery,
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
) => Promise<SDKResponse<BusinessUnit>>;

type UpdateBusinessUnitAddressAction = (
  payload: UpdateBusinessUnitAddressPayload,
  query: UpdateBusinessUnitAddressQuery,
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
) => Promise<SDKResponse<BusinessUnit>>;

type RemoveBusinessUnitAddressAction = (
  payload: RemoveBusinessUnitAddressPayload,
  query: RemoveBusinessUnitAddressQuery,
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
) => Promise<SDKResponse<BusinessUnit>>;

type SetBusinessUnitAndStoreKeysAction = (
  query: SetBusinessUnitAndStoreKeysQuery,
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

type CreateApprovalRuleAction = (
  payload: CreateApprovalRulePayload,
  query: CreateApprovalRuleQuery,
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
) => Promise<SDKResponse<ApprovalRule>>;

type QueryApprovalRulesAction = (
  query: QueryApprovalRulesQuery,
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
) => Promise<SDKResponse<PaginatedResult<ApprovalRule>>>;

type UpdateApprovalRuleAction = (
  payload: UpdateApprovalRulePayload,
  query: UpdateApprovalRuleQuery,
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
) => Promise<SDKResponse<ApprovalRule>>;

type QueryApprovalFlowsAction = (
  query: QueryApprovalFlowsQuery,
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
) => Promise<SDKResponse<PaginatedResult<ApprovalFlow>>>;

type ApproveApprovalFlowAction = (
  payload: ApproveApprovalFlowPayload,
  query: ApproveApprovalFlowQuery,
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
) => Promise<SDKResponse<ApprovalFlow>>;

type RejectApprovalFlowAction = (
  payload: RejectApprovalFlowPayload,
  query: RejectApprovalFlowQuery,
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
) => Promise<SDKResponse<ApprovalFlow>>;

export {
  type GetBusinessUnitAction,
  type GetBusinessUnitsAction,
  type CreateBusinessUnitAction,
  type UpdateBusinessUnitAction,
  type GetAssociateRolesAction,
  type GetAssociateAction,
  type AddAssociateAction,
  type UpdateAssociateAction,
  type RemoveAssociateAction,
  type GetCompaniesAction,
  type GetBusinessUnitOrdersAction,
  type AddBusinessUnitAddressAction,
  type UpdateBusinessUnitAddressAction,
  type RemoveBusinessUnitAddressAction,
  type SetBusinessUnitAndStoreKeysAction,
  type CreateApprovalRuleAction,
  type QueryApprovalRulesAction,
  type UpdateApprovalRuleAction,
  type QueryApprovalFlowsAction,
  type ApproveApprovalFlowAction,
  type RejectApprovalFlowAction,
};
