type CreateQuotePayload = {
  comment: string;
  purchaseOrderNumber?: string;
};

type RenegotiateQuotePayload = {
  comment: string;
};

export { type CreateQuotePayload, type RenegotiateQuotePayload };
