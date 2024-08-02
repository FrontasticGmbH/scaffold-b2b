import { SortAttribute } from '@/types/entity/sort-attribute';

export interface Options {
  cursor?: string;
  limit?: number;
  ids?: string[];
  states?: string[];
  businessUnitKey?: string;
  storeKey?: string;
  sortAttributes?: SortAttribute[];
}
