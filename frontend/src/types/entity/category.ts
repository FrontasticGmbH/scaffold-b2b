export interface Category {
  categoryId: string;
  categoryKey?: string;
  categoryRef?: string;
  name: string;
  path: string;
  descendants: Category[];
}
