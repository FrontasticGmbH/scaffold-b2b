export interface Category {
  categoryId: string;
  name: string;
  path: string;
  subCategories: Category[];
}
