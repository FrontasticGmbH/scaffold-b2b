import { SDK, ServerOptions } from "@commercetools/frontend-sdk";
import { ComposableCommerceEventsB2B } from "../../types/events/ComposableCommerceEventsB2B";
import {
	GetProductAction,
	ProductQueryAction,
	QueryProductCategoriesAction,
	GetSearchableProductAttributesAction,
} from "../../types/actions/ProductActions";
import {
	GetProductQuery,
	ProductQueryQuery,
	QueryProductCategoriesQuery,
} from "../../types/queries/ProductQueries";
import { FilterField, Product, Result } from "@shared/types/product";

export type ProductActions = {
	getProduct: GetProductAction;
	query: ProductQueryAction;
	queryCategories: QueryProductCategoriesAction;
	getSearchableAttributes: GetSearchableProductAttributesAction;
};

export const getProductActions = (
	sdk: SDK<ComposableCommerceEventsB2B>
): ProductActions => {
	return {
		getProduct: async (
			query: GetProductQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<Product>({
				actionName: "product/getProduct",
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		query: async (
			query?: ProductQueryQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<Result>({
				actionName: "product/query",
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		queryCategories: async (
			query?: QueryProductCategoriesQuery,
			options?: {
				serverOptions?: ServerOptions;
			}
		) => {
			const response = await sdk.callAction<Result>({
				actionName: "product/queryCategories",
				query,
				serverOptions: options?.serverOptions,
			});
			return response;
		},
		getSearchableAttributes: async (options?: {
			serverOptions?: ServerOptions;
		}) => {
			const response = await sdk.callAction<FilterField[]>({
				actionName: "product/searchableAttributes",
				serverOptions: options?.serverOptions,
			});
			return response;
		},
	};
};
