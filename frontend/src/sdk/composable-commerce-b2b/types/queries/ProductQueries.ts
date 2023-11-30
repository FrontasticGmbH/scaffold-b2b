import { CategoryQuery, ProductQuery } from "@shared/types/query";

type GetProductQuery = {
	id?: string;
	sku?: string;
};

type ProductQueryQuery = Omit<
	ProductQuery,
	"filters" | "facets" | "sortAttributes" | "storeKey"
>;

type QueryProductCategoriesQuery = {
	limit?: number;
	cursor?: string;
	parentId?: string;
	slug?: string;
	format?: string;
};

export {
	type GetProductQuery,
	type ProductQueryQuery,
	type QueryProductCategoriesQuery,
};
