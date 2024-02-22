import { SDK, ServerOptions } from "@commercetools/frontend-sdk";
import { ComposableCommerceEventsB2B } from "../../types/events/ComposableCommerceEventsB2B";
import {
    GetQuotationCartAction,
	CreateQuoteAction,
	QuoteQueryAction,
	QuoteRequestsQueryAction,
	AcceptQuoteAction,
	DeclineQuoteAction,
	RenegotiateQuoteAction,
	CancelQuoteAction,
} from "../../types/actions/QuoteActions";
import {
	CreateQuotePayload,
	RenegotiateQuotePayload,
} from "../../types/payloads/QuotePayloads";
import {
    GetQuotationCartQuery,
	CreateQuoteQuery,
	AcceptQuoteQuery,
	QuoteQueryQuery,
	QuoteRequestsQueryQuery,
	DeclineQuoteQuery,
	RenegotiateQuoteQuery,
	CancelQuoteQuery,
} from "../../types/queries/QuoteQueries";
import { Quote, QuoteRequest } from "@shared/types/quote";
import { PaginatedResult } from "@shared/types/result";
import { Cart } from "@shared/types/cart";

export type QuoteActions = {
    getQuotationCart: GetQuotationCartAction;
	createQuote: CreateQuoteAction;
	query: QuoteQueryAction;
	queryRequests: QuoteRequestsQueryAction;
	acceptQuote: AcceptQuoteAction;
	declineQuote: DeclineQuoteAction;
	renegotiateQuote: RenegotiateQuoteAction;
	cancelQuote: CancelQuoteAction;
};

export const getQuoteActions = (
	sdk: SDK<ComposableCommerceEventsB2B>
): QuoteActions => {
	return {
        getQuotationCart: async (
			query: GetQuotationCartQuery,
			options: { serverOptions?: ServerOptions } = {}
		) => {
			const response = await sdk.callAction<Cart>({
				actionName: "quote/getQuotationCart",
				query,
				serverOptions: options.serverOptions,
			});
			return response;
		},
		createQuote: async (
			payload: CreateQuotePayload,
			query: CreateQuoteQuery,
			options: { serverOptions?: ServerOptions } = {}
		) => {
			const response = await sdk.callAction<QuoteRequest>({
				actionName: "quote/createQuoteRequest",
				payload,
				query,
				serverOptions: options.serverOptions,
			});
			return response;
		},
		query: async (
			query: QuoteQueryQuery,
			options: { serverOptions?: ServerOptions } = {}
		) => {
			const response = await sdk.callAction<PaginatedResult<Quote>>({
				actionName: "quote/query",
				query,
				serverOptions: options.serverOptions,
			});
			return response;
		},
		queryRequests: async (
			query: QuoteRequestsQueryQuery,
			options: { serverOptions?: ServerOptions } = {}
		) => {
			const response = await sdk.callAction<
				PaginatedResult<QuoteRequest>
			>({
				actionName: "quote/queryQuoteRequests",
				query,
				serverOptions: options.serverOptions,
			});
			return response;
		},
		acceptQuote: async (
			query: AcceptQuoteQuery,
			options: { serverOptions?: ServerOptions } = {}
		) => {
			const response = await sdk.callAction<Quote>({
				actionName: "quote/acceptQuote",
				query,
				serverOptions: options.serverOptions,
			});
			return response;
		},
		declineQuote: async (
			query: DeclineQuoteQuery,
			options: { serverOptions?: ServerOptions } = {}
		) => {
			const response = await sdk.callAction<Quote>({
				actionName: "quote/declineQuote",
				query,
				serverOptions: options.serverOptions,
			});
			return response;
		},
		renegotiateQuote: async (
			payload: RenegotiateQuotePayload,
			query: RenegotiateQuoteQuery,
			options: { serverOptions?: ServerOptions } = {}
		) => {
			const response = await sdk.callAction<Quote>({
				actionName: "quote/renegotiateQuote",
				payload,
				query,
				serverOptions: options.serverOptions,
			});
			return response;
		},
		cancelQuote: async (
			query: CancelQuoteQuery,
			options: { serverOptions?: ServerOptions } = {}
		) => {
			const response = await sdk.callAction<QuoteRequest>({
				actionName: "quote/cancelQuoteRequest",
				query,
				serverOptions: options.serverOptions,
			});
			return response;
		},
	};
};
