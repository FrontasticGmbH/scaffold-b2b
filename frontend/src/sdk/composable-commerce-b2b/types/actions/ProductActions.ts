import { SDKResponse, ServerOptions } from "@commercetools/frontend-sdk";
import { FilterField, Product, Result } from "@shared/types/product";
import {
	GetProductQuery,
	ProductQueryQuery,
	QueryProductCategoriesQuery,
} from "../queries/ProductQueries";

type GetProductAction = (
	query: GetProductQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Product>>;

type ProductQueryAction = (
	query?: ProductQueryQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Result>>;

type QueryProductCategoriesAction = (
	query?: QueryProductCategoriesQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Result>>;

type GetSearchableProductAttributesAction = (options?: {
	serverOptions?: ServerOptions;
}) => Promise<SDKResponse<FilterField[]>>;

export {
	type GetProductAction,
	type ProductQueryAction,
	type QueryProductCategoriesAction,
	type GetSearchableProductAttributesAction,
};
