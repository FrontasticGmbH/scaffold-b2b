// import { SortOrder } from '@shared/types/query';

import { SortAttribute } from '@/types/entity/sort-attribute';

export interface Options {
  cursor?: string;
  limit?: number;
  ids?: string[];
  states?: string[];
  businessUnitKey?: string;
  createdFrom?: string;
  createdTo?: string;
  sortAttributes?: SortAttribute[];
}
