import { Variant } from './Variant';

export interface LineItem {
  lineItemId: string;
  productId?: string;
  name?: string;
  type?: string;
  addedAt?: Date;
  count?: number;
  variant?: Variant;
  _url?: string;
}
