import { QuoteRequestState, QuoteState } from "@shared/types/quote";

type CreateQuoteQuery = {
	businessUnitKey: string;
	storeKey: string;
};

type AcceptQuoteQuery = {
	id: string;
};

type QuoteQueryQuery = {
	limit?: number;
	cursor?: string;
	quoteIds?: string[];
	quoteStates?: QuoteState[] | QuoteRequestState[];
	// sortAttributes?: any; // TODO find accurate type and add
	query?: string;
};

type QuoteRequestsQueryQuery = {
	limit?: number;
	cursor?: string;
	quoteIds?: string[];
	quoteStates?: QuoteState[] | QuoteRequestState[];
	// sortAttributes?: any; // TODO find accurate type and add
	query?: string;
};

type DeclineQuoteQuery = {
	id: string;
};

type RenegotiateQuoteQuery = {
	id: string;
};

type CancelQuoteQuery = {
	id: string;
};

export {
	type CreateQuoteQuery,
	type AcceptQuoteQuery,
	type QuoteQueryQuery,
	type QuoteRequestsQueryQuery,
	type DeclineQuoteQuery,
	type RenegotiateQuoteQuery,
	type CancelQuoteQuery,
};
