import { Category } from '@shared/types/product/Category';
import { Category as EntityCategory } from '@/types/entity/category';

export const mapCategory = (category: Category): EntityCategory => {
  return {
    categoryId: category.categoryId ?? '',
    name: category.name ?? '',
    path: category._url ?? '',
    subCategories: category.subCategories.map(mapCategory),
  };
};
