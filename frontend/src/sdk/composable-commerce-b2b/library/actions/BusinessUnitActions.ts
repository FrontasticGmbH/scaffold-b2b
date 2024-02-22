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
} from '../../types/actions/BusinessUnitActions';
import { ComposableCommerceEventsB2B } from '../../types/events/ComposableCommerceEventsB2B';
import { Associate, AssociateRole, BusinessUnit } from '@shared/types/business-unit';
import { Order } from '@shared/types/cart';

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
};

export const getBusinessUnitActions = (sdk: SDK<ComposableCommerceEventsB2B>): BusinessUnitActions => {
  return {
    getBusinessUnit: async (
      query: GetBusinessUnitQuery,
      options?: {
        serverOptions?: ServerOptions;
      },
    ) => {
      const response = await sdk.callAction<BusinessUnit>({
        actionName: 'business-unit/getBusinessUnit',
        query,
        serverOptions: options?.serverOptions,
      });
      return response;
    },
    getBusinessUnits: async (
      query?: GetBusinessUnitsQuery,
      options?: {
        serverOptions?: ServerOptions;
      },
    ) => {
      const response = await sdk.callAction<BusinessUnit[]>({
        actionName: 'business-unit/getBusinessUnits',
        query,
        serverOptions: options?.serverOptions,
      });
      return response;
    },
    createBusinessUnit: async (
      payload: CreateBusinessUnitPayload,
      options?: {
        serverOptions?: ServerOptions;
      },
    ) => {
      const response = await sdk.callAction<BusinessUnit>({
        actionName: 'business-unit/create',
        payload,
        serverOptions: options?.serverOptions,
      });
      return response;
    },
    updateBusinessUnit: async (
      payload: UpdateBusinessUnitPayload,
      query: UpdateBusinessUnitQuery,
      options?: {
        serverOptions?: ServerOptions;
      },
    ) => {
      const response = await sdk.callAction<BusinessUnit>({
        actionName: 'business-unit/updateBusinessUnit',
        payload,
        query,
        serverOptions: options?.serverOptions,
      });
      return response;
    },
    getAssociateRoles: async (options?: { serverOptions?: ServerOptions }) => {
      const response = await sdk.callAction<AssociateRole[]>({
        actionName: 'business-unit/getAssociateRoles',
        serverOptions: options?.serverOptions,
      });
      return response;
    },
    getAssociate: async (
      query: GetAssociateQuery,
      options?: {
        serverOptions?: ServerOptions;
      },
    ) => {
      const response = await sdk.callAction<Associate>({
        actionName: 'business-unit/getAssociate',
        query,
        serverOptions: options?.serverOptions,
      });
      return response;
    },
    addAssociate: async (
      payload: AddAssociatePayload,
      query: AddAssociateQuery,
      options?: {
        serverOptions?: ServerOptions;
      },
    ) => {
      const response = await sdk.callAction<BusinessUnit>({
        actionName: 'business-unit/addAssociate',
        payload,
        query,
        serverOptions: options?.serverOptions,
      });
      return response;
    },
    updateAssociate: async (
      payload: UpdateAssociatePayload,
      query: UpdateAssociateQuery,
      options?: {
        serverOptions?: ServerOptions;
      },
    ) => {
      const response = await sdk.callAction<BusinessUnit>({
        actionName: 'business-unit/updateAssociate',
        payload,
        query,
        serverOptions: options?.serverOptions,
      });
      return response;
    },
    removeAssociate: async (
      payload: RemoveAssociatePayload,
      query: RemoveAssociateQuery,
      options?: {
        serverOptions?: ServerOptions;
      },
    ) => {
      const response = await sdk.callAction<BusinessUnit>({
        actionName: 'business-unit/removeAssociate',
        payload,
        query,
        serverOptions: options?.serverOptions,
      });
      return response;
    },
    getCompanies: async (options?: { serverOptions?: ServerOptions }) => {
      const response = await sdk.callAction<BusinessUnit[]>({
        actionName: 'business-unit/getCompanies',
        serverOptions: options?.serverOptions,
      });
      return response;
    },
    getOrders: async (
      query: GetBusinessUnitOrdersQuery,
      options?: {
        serverOptions?: ServerOptions;
      },
    ) => {
      const response = await sdk.callAction<Order[]>({
        actionName: 'business-unit/getBusinessUnitOrders',
        query,
        serverOptions: options?.serverOptions,
      });
      return response;
    },
    addAddress: async (
      payload: AddBusinessUnitAddressPayload,
      query: AddBusinessUnitAddressQuery,
      options?: {
        serverOptions?: ServerOptions;
      },
    ) => {
      const response = await sdk.callAction<BusinessUnit>({
        actionName: 'business-unit/addBusinessUnitAddress',
        payload,
        query,
        serverOptions: options?.serverOptions,
      });
      return response;
    },
    updateAddress: async (
      payload: UpdateBusinessUnitAddressPayload,
      query: UpdateBusinessUnitAddressQuery,
      options?: {
        serverOptions?: ServerOptions;
      },
    ) => {
      const response = await sdk.callAction<BusinessUnit>({
        actionName: 'business-unit/updateBusinessUnitAddress',
        payload,
        query,
        serverOptions: options?.serverOptions,
      });
      return response;
    },
    removeAddress: async (
      payload: RemoveBusinessUnitAddressPayload,
      query: RemoveBusinessUnitAddressQuery,
      options?: {
        serverOptions?: ServerOptions;
      },
    ) => {
      const response = await sdk.callAction<BusinessUnit>({
        actionName: 'business-unit/removeBusinessUnitAddress',
        payload,
        query,
        serverOptions: options?.serverOptions,
      });
      return response;
    },
    setBusinessUnitAndStoreKeys: async (
      query: SetBusinessUnitAndStoreKeysQuery,
      options?: {
        serverOptions?: ServerOptions;
      },
    ) => {
      const response = await sdk.callAction<void>({
        actionName: 'business-unit/setBusinessUnitAndStoreKeys',
        query,
        serverOptions: options?.serverOptions,
      });
      return response;
    },
  };
};
