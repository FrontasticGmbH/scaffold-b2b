import { SDK, ServerOptions } from "@commercetools/frontend-sdk";
import {
	CreateBusinessUnitPayload,
	UpdateBusinessUnitPayload,
	AddAssociatePayload,
	UpdateAssociatePayload,
	RemoveAssociatePayload,
	AddBusinessUnitAddressPayload,
	UpdateBusinessUnitAddressPayload,
	RemoveBusinessUnitAddressPayload,
} from "../../types/payloads/BusinessUnitPayloads";
import {
	GetBusinessUnitQuery,
	GetBusinessUnitsQuery,
	UpdateBusinessUnitQuery,
	RemoveBusinessUnitQuery,
	AddAssociateQuery,
	UpdateAssociateQuery,
	RemoveAssociateQuery,
	GetBusinessUnitOrdersQuery,
	AddBusinessUnitAddressQuery,
	UpdateBusinessUnitAddressQuery,
	RemoveBusinessUnitAddressQuery,
} from "../../types/queries/BusinessUnitQueries";
import {
	GetBusinessUnitAction,
	GetBusinessUnitsAction,
	CreateBusinessUnitAction,
	UpdateBusinessUnitAction,
	RemoveBusinessUnitAction,
	GetAssociateRolesAction,
	AddAssociateAction,
	UpdateAssociateAction,
	RemoveAssociateAction,
	GetCompaniesAction,
	GetBusinessUnitOrdersAction,
	AddBusinessUnitAddressAction,
	UpdateBusinessUnitAddressAction,
	RemoveBusinessUnitAddressAction,
} from "../../types/actions/BusinessUnitActions";
import { ComposableCommerceEventsB2B } from "../../types/events/ComposableCommerceEventsB2B";
import { AssociateRole, BusinessUnit } from "@shared/types/business-unit";
import { Order } from "@shared/types/cart";

export type BusinessUnitActions = {
	getBusinessUnit: GetBusinessUnitAction;
	getBusinessUnits: GetBusinessUnitsAction;
	createBusinessUnit: CreateBusinessUnitAction;
	updateBusinessUnit: UpdateBusinessUnitAction;
	removeBusinessUnit: RemoveBusinessUnitAction;
	getAssociateRoles: GetAssociateRolesAction;
	addAssociate: AddAssociateAction;
	updateAssociate: UpdateAssociateAction;
	removeAssociate: RemoveAssociateAction;
	getCompanies: GetCompaniesAction;
	getOrders: GetBusinessUnitOrdersAction;
	addAddress: AddBusinessUnitAddressAction;
	updateAddress: UpdateBusinessUnitAddressAction;
	removeAddress: RemoveBusinessUnitAddressAction;
};

export const getBusinessUnitActions = (
	sdk: SDK<ComposableCommerceEventsB2B>
): BusinessUnitActions => {
	return {
		getBusinessUnit: async (
			query: GetBusinessUnitQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<BusinessUnit>({
				actionName: "business-unit/getByKey",
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		getBusinessUnits: async (
			query?: GetBusinessUnitsQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<BusinessUnit[]>({
				actionName: "business-unit/getBusinessUnits",
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		createBusinessUnit: async (
			payload: CreateBusinessUnitPayload,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<BusinessUnit>({
				actionName: "business-unit/create",
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
			}
		) => {
			const response = await sdk.callAction<BusinessUnit>({
				actionName: "business-unit/updateBusinessUnit",
				payload,
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		removeBusinessUnit: async (
			query: RemoveBusinessUnitQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<BusinessUnit>({
				actionName: "business-unit/remove",
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		getAssociateRoles: async (options?: {
			serverOptions?: ServerOptions;
		}) => {
			const response = await sdk.callAction<AssociateRole[]>({
				actionName: "business-unit/getAssociateRoles",
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		addAssociate: async (
			payload: AddAssociatePayload,
			query: AddAssociateQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<BusinessUnit>({
				actionName: "business-unit/addAssociate",
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
			}
		) => {
			const response = await sdk.callAction<BusinessUnit>({
				actionName: "business-unit/updateAssociate",
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
			}
		) => {
			const response = await sdk.callAction<BusinessUnit>({
				actionName: "business-unit/removeAssociate",
				payload,
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		getCompanies: async (options?: { serverOptions?: ServerOptions }) => {
			const response = await sdk.callAction<BusinessUnit[]>({
				actionName: "business-unit/getCompanies",
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		getOrders: async (
			query: GetBusinessUnitOrdersQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<Order[]>({
				actionName: "business-unit/getBusinessUnitOrders",
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
			}
		) => {
			const response = await sdk.callAction<BusinessUnit>({
				actionName: "business-unit/addBusinessUnitAddress",
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
			}
		) => {
			const response = await sdk.callAction<BusinessUnit>({
				actionName: "business-unit/updateBusinessUnitAddress",
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
			}
		) => {
			const response = await sdk.callAction<BusinessUnit>({
				actionName: "business-unit/removeBusinessUnitAddress",
				payload,
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
	};
};
