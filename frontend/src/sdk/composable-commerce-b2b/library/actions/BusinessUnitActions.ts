import { SDK, ServerOptions } from '@commercetools/frontend-sdk';
import {
  CreateBusinessUnitPayload,
  UpdateBusinessUnitPayload,
  AddAssociatePayload,
  UpdateAssociatePayload,
  RemoveAssociatePayload,
  AddBusinessUnitAddressPayload,
  UpdateBusinessUnitAddressPayload,
  RemoveBusinessUnitAddressPayload,
  CreateApprovalRulePayload,
  UpdateApprovalRulePayload,
  ApproveApprovalFlowPayload,
  RejectApprovalFlowPayload,
} from '../../types/payloads/BusinessUnitPayloads';
import {
  GetBusinessUnitQuery,
  GetBusinessUnitsQuery,
  UpdateBusinessUnitQuery,
  GetAssociateQuery,
  AddAssociateQuery,
  UpdateAssociateQuery,
  RemoveAssociateQuery,
  GetBusinessUnitOrdersQuery,
  AddBusinessUnitAddressQuery,
  UpdateBusinessUnitAddressQuery,
  RemoveBusinessUnitAddressQuery,
  SetBusinessUnitAndStoreKeysQuery,
  CreateApprovalRuleQuery,
  QueryApprovalRulesQuery,
  UpdateApprovalRuleQuery,
  QueryApprovalFlowsQuery,
  RejectApprovalFlowQuery,
  ApproveApprovalFlowQuery,
} from '../../types/queries/BusinessUnitQueries';
import {
  GetBusinessUnitAction,
  GetBusinessUnitsAction,
  CreateBusinessUnitAction,
  UpdateBusinessUnitAction,
  GetAssociateRolesAction,
  GetAssociateAction,
  AddAssociateAction,
  UpdateAssociateAction,
  RemoveAssociateAction,
  GetCompaniesAction,
  GetBusinessUnitOrdersAction,
  AddBusinessUnitAddressAction,
  UpdateBusinessUnitAddressAction,
  RemoveBusinessUnitAddressAction,
  SetBusinessUnitAndStoreKeysAction,
  CreateApprovalRuleAction,
  QueryApprovalFlowsAction,
  QueryApprovalRulesAction,
  UpdateApprovalRuleAction,
  RejectApprovalFlowAction,
  ApproveApprovalFlowAction,
} from '../../types/actions/BusinessUnitActions';
import { ComposableCommerceEventsB2B } from '../../types/events/ComposableCommerceEventsB2B';
import { ApprovalFlow, ApprovalRule, Associate, AssociateRole, BusinessUnit } from '@shared/types/business-unit';
import { Order } from '@shared/types/cart';
import { PaginatedResult } from '@shared/types/result';

export type BusinessUnitActions = {
  getBusinessUnit: GetBusinessUnitAction;
  getBusinessUnits: GetBusinessUnitsAction;
  createBusinessUnit: CreateBusinessUnitAction;
  updateBusinessUnit: UpdateBusinessUnitAction;
  getAssociateRoles: GetAssociateRolesAction;
  getAssociate: GetAssociateAction;
  addAssociate: AddAssociateAction;
  updateAssociate: UpdateAssociateAction;
  removeAssociate: RemoveAssociateAction;
  getCompanies: GetCompaniesAction;
  getOrders: GetBusinessUnitOrdersAction;
  addAddress: AddBusinessUnitAddressAction;
  updateAddress: UpdateBusinessUnitAddressAction;
  removeAddress: RemoveBusinessUnitAddressAction;
  setBusinessUnitAndStoreKeys: SetBusinessUnitAndStoreKeysAction;
  createApprovalRule: CreateApprovalRuleAction;
  queryApprovalRules: QueryApprovalRulesAction;
  updateApprovalRule: UpdateApprovalRuleAction;
  queryApprovalFlows: QueryApprovalFlowsAction;
  approveApprovalFlow: ApproveApprovalFlowAction;
  rejectApprovalFlow: RejectApprovalFlowAction;
};

export const getBusinessUnitActions = (sdk: SDK<ComposableCommerceEventsB2B>): BusinessUnitActions => {
  return {
    getBusinessUnit: async (
      query: GetBusinessUnitQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<BusinessUnit>({
        actionName: 'business-unit/getBusinessUnit',
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    getBusinessUnits: async (
      query?: GetBusinessUnitsQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<BusinessUnit[]>({
        actionName: 'business-unit/getBusinessUnits',
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    createBusinessUnit: async (
      payload: CreateBusinessUnitPayload,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<BusinessUnit>({
        actionName: 'business-unit/create',
        payload,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    updateBusinessUnit: async (
      payload: UpdateBusinessUnitPayload,
      query: UpdateBusinessUnitQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<BusinessUnit>({
        actionName: 'business-unit/updateBusinessUnit',
        payload,
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    getAssociateRoles: async (
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<AssociateRole[]>({
        actionName: 'business-unit/getAssociateRoles',
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    getAssociate: async (
      query: GetAssociateQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Associate>({
        actionName: 'business-unit/getAssociate',
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    addAssociate: async (
      payload: AddAssociatePayload,
      query: AddAssociateQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<BusinessUnit>({
        actionName: 'business-unit/addAssociate',
        payload,
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    updateAssociate: async (
      payload: UpdateAssociatePayload,
      query: UpdateAssociateQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<BusinessUnit>({
        actionName: 'business-unit/updateAssociate',
        payload,
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    removeAssociate: async (
      payload: RemoveAssociatePayload,
      query: RemoveAssociateQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<BusinessUnit>({
        actionName: 'business-unit/removeAssociate',
        payload,
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    getCompanies: async (
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<BusinessUnit[]>({
        actionName: 'business-unit/getCompanies',
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    getOrders: async (
      query: GetBusinessUnitOrdersQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Order[]>({
        actionName: 'business-unit/getBusinessUnitOrders',
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    addAddress: async (
      payload: AddBusinessUnitAddressPayload,
      query: AddBusinessUnitAddressQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<BusinessUnit>({
        actionName: 'business-unit/addBusinessUnitAddress',
        payload,
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    updateAddress: async (
      payload: UpdateBusinessUnitAddressPayload,
      query: UpdateBusinessUnitAddressQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<BusinessUnit>({
        actionName: 'business-unit/updateBusinessUnitAddress',
        payload,
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    removeAddress: async (
      payload: RemoveBusinessUnitAddressPayload,
      query: RemoveBusinessUnitAddressQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<BusinessUnit>({
        actionName: 'business-unit/removeBusinessUnitAddress',
        payload,
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    setBusinessUnitAndStoreKeys: async (
      query: SetBusinessUnitAndStoreKeysQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<void>({
        actionName: 'business-unit/setBusinessUnitAndStoreKeys',
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    createApprovalRule: async (
      payload: CreateApprovalRulePayload,
      query: CreateApprovalRuleQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<ApprovalRule>({
        actionName: 'business-unit/createApprovalRule',
        payload,
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    queryApprovalRules: async (
      query: QueryApprovalRulesQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<PaginatedResult<ApprovalRule>>({
        actionName: 'business-unit/queryApprovalRules',
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    updateApprovalRule: async (
      payload: UpdateApprovalRulePayload,
      query: UpdateApprovalRuleQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<ApprovalRule>({
        actionName: 'business-unit/updateApprovalRule',
        payload,
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    queryApprovalFlows: async (
      query: QueryApprovalFlowsQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<PaginatedResult<ApprovalFlow>>({
        actionName: 'business-unit/queryApprovalFlows',
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    approveApprovalFlow: async (
      payload: ApproveApprovalFlowPayload,
      query: ApproveApprovalFlowQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<ApprovalFlow>({
        actionName: 'business-unit/approveApprovalFlow',
        payload,
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    rejectApprovalFlow: async (
      payload: RejectApprovalFlowPayload,
      query: RejectApprovalFlowQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<ApprovalFlow>({
        actionName: 'business-unit/rejectApprovalFlow',
        payload,
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
  };
};
