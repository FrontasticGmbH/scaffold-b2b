import { Quote } from './Quote';
import { QuoteRequest } from './QuoteRequest';

export interface Result {
  total?: number;
  previousCursor?: string;
  nextCursor?: string;
  count: number;
  items: Quote[] | QuoteRequest[];
  query?: any;
}
