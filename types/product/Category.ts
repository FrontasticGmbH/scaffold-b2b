export interface Category {
  categoryId?: string;
  categoryKey?: string;
  categoryRef?: string;
  parentId?: string;
  parentKey?: string;
  parentRef?: string;
  name?: string;
  depth?: number;
  _url?: string;
  slug?: string;
  descendants?: Category[];
}
