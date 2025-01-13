import { LocalizedString } from '../query';

export interface Category {
  categoryId?: string;
  categoryKey?: string;
  categoryRef?: string;
  parentId?: string;
  parentKey?: string;
  parentRef?: string;
  name?: string;
  depth?: number;
  _url?: LocalizedString;
  slug?: string;
  descendants?: Category[];
}
