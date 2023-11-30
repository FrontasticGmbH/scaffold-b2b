export interface Category {
  categoryId?: string;
  parentId?: string;
  name?: string;
  depth?: number;
  _url?: string;
  slug?: string;
  subCategories: Category[];
}
