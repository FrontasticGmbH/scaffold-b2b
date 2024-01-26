import { Order } from './Order';

export interface Result {
  total?: number;
  previousCursor?: string;
  nextCursor?: string;
  count: number;
  items: Order[];
  query?: any;
}
