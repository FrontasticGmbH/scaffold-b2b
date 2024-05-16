// import { SortOrder } from '@shared/types/query';

// interface SortAttribute {
//   [key: string]: 'asc' | 'desc';
// }
//
// interface SortAttributesParams {
//   [index: string]: SortAttribute;
// }

export interface Options {
  cursor?: string;
  limit?: number;
  ids?: string[];
  states?: string[];
  businessUnitKey?: string;
  createdFrom?: string;
  createdTo?: string;
  sortAttributes?: string;
}
